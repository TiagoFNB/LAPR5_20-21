using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;
using DDDNetCore.DriverDuties.Dto;
using DDDNetCore.DriverDuties.Services;
using DDDNetCore.ImportFile.Dto;
using DDDNetCore.ImportFile.Model;
using DDDNetCore.Trips.DTO;
using DDDNetCore.Trips.Services;
using DDDNetCore.VehicleDuties.Dto;
using DDDNetCore.VehicleDuties.Services;
using DDDNetCore.WorkBlocks.Services;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;

namespace DDDNetCore.ImportFile.Services
{
    public class ImportGlxService : ImportGlxServiceInterface
    {
        private readonly IRegisterTripService _RegTripService;
        private readonly IHttpClientFactory _clientFactory;
        private readonly IVehicleDutyService _RegVehicleDutyservice;
        private readonly IDriverDutyService _RegDriverDutyservice;
        private readonly IWorkBlocksOfVehicleDutyService _RegWorkBlockservice;
     
        

        public ImportGlxService(IHttpClientFactory clientFactory, IRegisterTripService RegTripService, IVehicleDutyService RegVehicleDutyservice, IDriverDutyService RegDriverDutyservice, IWorkBlocksOfVehicleDutyService regWorkBlockservice)
        {

            this._clientFactory = clientFactory;
            this._RegTripService = RegTripService;
            this._RegVehicleDutyservice = RegVehicleDutyservice;
            this._RegDriverDutyservice = RegDriverDutyservice;
            this._RegWorkBlockservice = regWorkBlockservice;
            
        }


       
        public async Task<ImportFileReplyDto> ImportGlx(string filepath, string token)
        {

            XmlDocument document = new XmlDocument();
            
              
                document.Load(filepath);

          
          
            
            // read the file to models in memory
            WorkBlocksModel workblocks = readWorkBlocks(document);
            VehicleDutiesModel vehicleDuties = readVehicleDuties(document, workblocks);
            DriverDutiesModel driverDuties =  readDriverDuties(document, workblocks);
            TripsModel trips = await readTrips(document, token);

            

            //register stuff read from file
            await RegisterTrips(trips, token);
            
            await RegisterVehicleDuties(vehicleDuties);
            await RegisterWorkBlocks(workblocks, token);
            await RegisterDriverDuties(driverDuties, workblocks);

            int numberOfLinesPresentInFile = workblocks.WorkBlocksInFile + vehicleDuties.VehicleDutiesInFile + driverDuties.DriverDutiesInFile + trips.tripsInFile;
            int numberOfImportedObjects = workblocks.numberOfWorkBlocksImported + vehicleDuties.numberOfVehicleDutiesImported + driverDuties.numberOfDriverDutiesImported + trips.numberOfTripsImported-1;
            if (numberOfImportedObjects <= 0)
            {
                numberOfImportedObjects = 0; // becouse i subtract 1 to numberOfImportedObjects there is a risk that it can be -1 so i set it to 0
            }


            //join all errors in one list
            List<string> errors = new List<string>();
            errors.AddRange(trips.errors);
            errors.AddRange(workblocks.errors);
             errors.AddRange(driverDuties.errors);
             errors.AddRange(vehicleDuties.errors);

            ImportFileReplyDto dto = new ImportFileReplyDto(errors, numberOfLinesPresentInFile, numberOfImportedObjects);

          
            return dto;

        }

       


       




        private async Task<TripsModel> readTrips(XmlDocument document, string token)
        {

            TripsModel tripsReaded = new TripsModel();

            ////////////////// READING WORCKBLOCKS
            XmlNodeList elemList = document.GetElementsByTagName("Trip");

            if (elemList != null)
            {

            
                foreach (XmlNode xmlNode in elemList) // vai a cada trip
                {

                    tripsReaded.tripsInFile++;
                    try
                {
                    string key = xmlNode.Attributes["key"].InnerText;
                    string path = xmlNode.Attributes["Path"].InnerText;
                    string line = null;
                    
                        if (xmlNode.Attributes["Line"] == null) // if there are no reference to line from file im gona get it from mdr using the path
                    {
                        line = await ObtainLineId(token, path);
                    }
                    else // else i use the reference in the file
                    {
                        line = xmlNode.Attributes["Line"].InnerText;
                    }

                    if (line == null) // if the line dont exist at all 
                    {
                        tripsReaded.errors.Add("Trip with key: " + key + " of the path: " + path + " dont have a valid line");
                    }
                        
                    else  // if line dose not exist in file nor in the mdr i dont register the path and add to list of errors
                    {



                        XmlNode xmlNode3 = xmlNode.ChildNodes[0].ChildNodes[0];// vai dentro do elemento "PassingTimes" que é o primeiro childNode[0]
                                                                               // depois vai dentro do primeiro PassingTime que é o segundo childNode[0]

                        string startTimeOfFirstPassingTime = xmlNode3.Attributes["Time"].InnerText;// vai buscar o valor do elemento Time


                        tripsReaded.addTrip(key, path, line, startTimeOfFirstPassingTime);
                    }
                    
                  

                }
                catch (NullReferenceException e)
                {
                        tripsReaded.errors.Add("There is a trip without necessary atributes in file");
                    }
            }

          
            
            }
            return tripsReaded;
        }




        private WorkBlocksModel readWorkBlocks(XmlDocument document) {

            WorkBlocksModel wb = new WorkBlocksModel();
           
            ////////////////// READING WORCKBLOCKS
            XmlNodeList elemList = document.GetElementsByTagName("WorkBlock");

            if (elemList != null)
            {

          
            foreach (XmlNode xmlNode in elemList) // vai a cada workblock
            {
                    wb.WorkBlocksInFile++;
                    try
                    {

                    
                string key = xmlNode.Attributes["key"].InnerText;
                string stime = xmlNode.Attributes["StartTime"].InnerText;
                string etime = xmlNode.Attributes["EndTime"].InnerText;
                  
                List<string> workblockTrips = new List<string>();
                 
                    foreach (XmlNode xmlNode3 in xmlNode.ChildNodes[0].ChildNodes) // vai dentro do elemento "Trip" 
                    // que é o childNode[0] de cada workblock e depois vai a todos os elementos "ref" dentro das trips
                    {
                    workblockTrips.Add(xmlNode3.Attributes["key"].InnerText);// vai buscar o valor do elemento ref
                    }


              

                wb.addWorkBlock(key,stime, etime, workblockTrips);
                    }catch(NullReferenceException e)
                    {
                        wb.errors.Add("There is a workblock without the necessary attributes in file");
                    }

            }
            }
            return wb;
           
        

           
        }



        private VehicleDutiesModel readVehicleDuties(XmlDocument document, WorkBlocksModel workblocks)
        {

            VehicleDutiesModel vhd = new VehicleDutiesModel();
          
            ////////////////// READING VehicleDuty
            XmlNodeList elemList = document.GetElementsByTagName("VehicleDuty");

            if (elemList != null)
            {

         
            foreach (XmlNode xmlNode in elemList) // vai a cada workblock
            {
                    vhd.VehicleDutiesInFile++;

                    try
                    {

                    

                string key = xmlNode.Attributes["key"].InnerText;
               
                List<string> VehicleDutyWorkblocks = new List<string>();

                foreach (XmlNode xmlNode3 in xmlNode.ChildNodes[0].ChildNodes) // vai dentro do elemento "WorkBlocks" 
                                                                               // que é o childNode[0] de cada workblock e depois vai a todos os elementos "ref" dentro dos WorkBlocks
                {
                    Boolean workBlockFound = false;
                    string vehicleDutyWorkBlock = xmlNode3.Attributes["key"].InnerText; // vai buscar a key dos worckblocks  que pertence

                    foreach (WorkBlockModel wb in workblocks.workBlocksList) // vou a esse worckblock e adiciono o vehicle duty no qual estou
                        if(wb.key == vehicleDutyWorkBlock)
                        {

                            string keyAlphanumeric = makeDutyCodesAlphanumeric(key, "vehicleDuty");


                            wb.workBlockDTO.DefineVehicleDuty(keyAlphanumeric);
                            workBlockFound = true;
                        }
                    if (workBlockFound == false)
                    {
                        vhd.errors.Add("the work block with key"+ vehicleDutyWorkBlock+"of the vehicle duty with key "+key+ "does not exists");
                    }

                   
                }
                vhd.addVehicleDuties(makeDutyCodesAlphanumeric(key, "vehicleDuty"));

                    }catch(NullReferenceException e)
                    {
                        vhd.errors.Add("There is a Vehicle Duty without the necessary attributes in file");
                    }



            }
            }
            return vhd;




        }
        private DriverDutiesModel readDriverDuties(XmlDocument document, WorkBlocksModel workBlocksModel)
        {

            DriverDutiesModel driverDuties = new DriverDutiesModel();

            ////////////////// READING WORCKBLOCKS
            XmlNodeList elemList = document.GetElementsByTagName("DriverDuty");

            if (elemList != null)
            {

            
            foreach (XmlNode xmlNode in elemList) // vai a cada workblock
            {
                    driverDuties.DriverDutiesInFile++;
                    try
                    {

                   

                string key = xmlNode.Attributes["key"].InnerText;

                        // List<string> driverDutyWorckBlocks = new List<string>();  COMENTADO porque posso querer de mudar de estutura no futuro
                        List<string> driverDutyWorkBlocks = new List<string>();
                foreach (XmlNode xmlNode3 in xmlNode.ChildNodes[0].ChildNodes) // vai dentro do elemento "WorkBlocks" 
                                                                               // que é o childNode[0] de cada driverDuty e depois vai a todos os elementos "ref" 
                {
                    string driverDutyWorkBlockKey = xmlNode3.Attributes["key"].InnerText;
                            driverDutyWorkBlocks.Add(driverDutyWorkBlockKey);
                    //  driverDutyWorckBlocks.Add(xmlNode3.Attributes["key"].InnerText);//COMENTADO porque posso querer de mudar de estutura no futuro

                            //foreach (WorkBlockModel wb in workBlocksModel.workBlocksList) // procuro o workblock com essa key e defino nesse workblock o driverduty
                            //{
                            //    if (wb.key == driverDutyWorkBlockKey)
                            //    {
                            //        string keyAlphanumeric = makeDutyCodesAlphanumeric(key, "driverDuty");
                            //        wb.defineDriverDutyCode(keyAlphanumeric);
                            //    }
                            //}
                        }



                driverDuties.addDriverDuty(makeDutyCodesAlphanumeric(key, "driverDuty"), driverDutyWorkBlocks);
                    }
                    catch (NullReferenceException e)
                    {
                        driverDuties.errors.Add("There is a Driver Duty without the necessary attributes in file");
                    }
                }
            }
            return driverDuties;




        }
        private string makeDutyCodesAlphanumeric(string code, string typeOfDuty)
        {
            string baseCode = null;
            if (typeOfDuty == "vehicleDuty")
            {
                baseCode  = "VehicleDut";
            }
            else 
            {
                 baseCode = "DriverDuty";
            }


            string numberOfVehicleDuty = "";

            numberOfVehicleDuty = Regex.Match(code, @"\d+").Value; //obtain the number inside the code

           
                int lengthOfNumber = numberOfVehicleDuty.Length;

                string baseCodeWithRightAmmountOfChars = baseCode.Remove(baseCode.Length - lengthOfNumber);
                code = baseCodeWithRightAmmountOfChars + numberOfVehicleDuty;

            return code;
            
        }

        private async Task<string> ObtainLineId(string token, string path) // when a trip in file dont have reference to the line
        {
            
            var request = new HttpRequestMessage(HttpMethod.Get,
                "path/" + path);
            var tok = token.Split(" ");

            request.Headers.Authorization = new AuthenticationHeaderValue(tok[0], tok[1]);
            var client = _clientFactory.CreateClient("mdr");
            var response = await client.SendAsync(request);


             if (response.StatusCode == HttpStatusCode.OK)
             {

            string responseString = await response.Content.ReadAsStringAsync();
            JObject o = JObject.Parse(responseString);
            var lineId = o["line"].ToString();
            return lineId;
              }
             else
             {
              return null;
              }
        }

      

        private async Task<int> RegisterTrips(TripsModel trips, string token)
        {
            int numberoferrors = 0;
            foreach (RegisterTripsDto m in trips.TripsDtoList)
            {
                try
                {
                    List<ResponseTripDto> x = await _RegTripService.AddAsync(token, m);
                    if (x != null && x.Count>0)
                    {
                        trips.numberOfTripsImported++;
                    }
                    else
                    {
                        trips.errors.Add("Trip with key: " + m.Key + " could not be created");
                    }
                    




                }
                catch (Exception e)
                {
                    if (e.InnerException != null)
                    {
                        if (e.InnerException.Message.Contains("duplicate"))
                        {
                            trips.errors.Add("Trip with key: " + m.Key + " already exists");
                        }
                        else
                        {
                            trips.errors.Add("Trip with key: " + m.Key +" "+ e.InnerException.Message);
                        }

                    }
                   
                 
                    else 
                    {
                        trips.errors.Add("Trip with key: " + m.Key + e.Message);
                    }

                   

                    numberoferrors++;
                }

            }
            return numberoferrors;
        }


        private async Task<int> RegisterDriverDuties(DriverDutiesModel driverduties, WorkBlocksModel workBlocksModel)
        {
            int numberoferrors = 0;
            foreach (DriverDutyModel m in driverduties.DriverDuties)
            {
                try
                {
                   
                    List<string> workBlocksOfThisDriverDuty = new List<string>();

                    foreach (WorkBlockModel w in workBlocksModel.workBlocksList)
                    {
                        if (m.workBloks.Contains(w.key))
                        {
                            if (w.automaticGeneratedKeyWhenWrockBlockIsRegistered != null)
                            {
                                workBlocksOfThisDriverDuty.Add(w.automaticGeneratedKeyWhenWrockBlockIsRegistered);
                            }
                           
                        }
                    }

                        DriverDutyPlannedDto driverDutyPlaned = new DriverDutyPlannedDto(m.driverDutyDto.DriverDutyCode, null, workBlocksOfThisDriverDuty);
                  //  List<DriverDutyPlannedDto> l = new List<DriverDutyPlannedDto>();
                    //l.Add(driverDutyPlaned);
                        var x = await _RegDriverDutyservice.AddPlannedDriverDutyAsync(driverDutyPlaned);

                  
                    
                        driverduties.numberOfDriverDutiesImported++;
                   

                }
                catch (Exception e)
                {
                    if (e.InnerException != null)
                    {
                        if (e.InnerException.Message.Contains("duplicate"))
                        {
                            driverduties.errors.Add("DriverDuty with key: " + m.driverDutyDto.DriverDutyCode + " already exists");
                        }
                        else
                        {
                            driverduties.errors.Add("Trip with key: " + m.driverDutyDto.DriverDutyCode + " " + e.InnerException.Message);
                        }

                    }


                    else
                    {
                        driverduties.errors.Add("Trip with key: " + m.driverDutyDto.DriverDutyCode + " " +e.Message);
                    }


                    numberoferrors++;
                }

            }
            return numberoferrors;
        }



        private async Task<int> RegisterVehicleDuties(VehicleDutiesModel vehicleDuties)
        {
            int numberoferrors = 0;
            foreach (VehicleDutyDto m in vehicleDuties.VehicleDutyDtoList)
            {
                try
                {
                    var x = await _RegVehicleDutyservice.AddAsync(m);
                    vehicleDuties.numberOfVehicleDutiesImported++;


                }
                catch (Exception e)
                {
                    if (e.InnerException != null)
                    {
                        if (e.InnerException.Message.Contains("duplicate"))
                        {
                            vehicleDuties.errors.Add("VehicleDuty with key: " + m.VehicleDutyCode + " already exists");
                        }
                        else
                        {
                            vehicleDuties.errors.Add("VehicleDuty with key: " + m.VehicleDutyCode + " " + e.InnerException.Message);
                        }

                    }


                    else
                    {
                        vehicleDuties.errors.Add("VehicleDuty with key: " + m.VehicleDutyCode + e.Message);
                    }


                    numberoferrors++;
                }

            }
            return numberoferrors;
        }

        private async Task<int> RegisterWorkBlocks(WorkBlocksModel workBlocksModel, string token)
        {
            int numberoferrors = 0;
            foreach (WorkBlockModel m in workBlocksModel.workBlocksList)
            {
                try
                {
                    var x = await _RegWorkBlockservice.AddAsync(token,m.workBlockDTO);
                    m.defineAutoGeneratedKey(x.Wks[0].Code);
                    workBlocksModel.numberOfWorkBlocksImported++;

                }
                catch (Exception e)
                {
                    if (e.InnerException != null)
                    {
                        if (e.InnerException.Message.Contains("duplicate"))
                        {
                            workBlocksModel.errors.Add("WorkBlock with key: " + m.key + " already exists");
                        }
                        else
                        {
                            workBlocksModel.errors.Add("WorkBlock with key: " + m.key + " " + e.InnerException.Message);
                        }

                    }


                    else
                    {
                        workBlocksModel.errors.Add("WorkBlock with key: " + m.key + e.Message);
                    }


                    numberoferrors++;
                }

            }
            return numberoferrors;
        }


        
    }
}
