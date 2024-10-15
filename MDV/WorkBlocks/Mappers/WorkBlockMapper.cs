using System;
using DDDNetCore.Trips.Domain;
using DDDNetCore.Trips.Domain.ValueObjects;
using DDDNetCore.WorkBlocks.Domain;
using DDDNetCore.WorkBlocks.Dto;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace DDDNetCore.WorkBlocks.Mappers
{
    public class WorkBlockMapper : IWorkBlockMapper
    {

        public WorkBlockGeneratedDto MapFromDomainToGeneratedDto(ICollection<WorkBlock> workBlocks)
        {
            WorkBlockDto[] wks = new WorkBlockDto[workBlocks.Count];

            int i = 0;
            foreach(WorkBlock wk in workBlocks)
            {

                Trip[] trips = wk.Trips.ToArray();
                string[] tripsString = trips.OfType<Trip>().Select(o => o.Id.AsString()).ToArray();

                string dvCode;
                if(wk.DriverDutyCode == null)
                {
                    dvCode = null;
                }
                else
                {
                    dvCode = wk.DriverDutyCode.AsString();
                }
                 
                wks[i] = new WorkBlockDto(wk.Id.Value,dvCode, wk.VehicleDutyCode.AsString(), wk.StartDateTime.DateTime.ToShortDateString(),
                    wk.StartDateTime.DateTime.ToString("HH:mm:ss"), wk.EndDateTime.DateTime.ToShortDateString(), wk.EndDateTime.DateTime.ToString("HH:mm:ss"), tripsString);


                i++;
            }


            return new WorkBlockGeneratedDto(wks);
        }

        public ReplyWorkBlockDto MapFromDomain2Dto(WorkBlock wb)
        {
            string[] tripsString=null;
            if (wb.Trips != null)
            {
                Trip[] trips = wb.Trips.ToArray();
                tripsString = trips.OfType<Trip>().Select(o => o.Id.AsString()).ToArray();
            }
            
            

            string dvCode;
            if (wb.DriverDutyCode == null)
            {
                dvCode = null;
            }
            else
            {
                dvCode = wb.DriverDutyCode.AsString();
            }


            ReplyWorkBlockDto registerTripDto = new ReplyWorkBlockDto(wb.Id.Value, dvCode, wb.VehicleDutyCode.Value, TransformStringHourMinSecToSeconds(wb.StartDateTime.DateTime.ToString("HH:mm:ss")),
                TransformStringHourMinSecToSeconds(wb.EndDateTime.DateTime.ToString("HH:mm:ss")), tripsString,wb.StartDateTime.DateTime.ToShortDateString());

            return registerTripDto;
        }

        private int TransformStringHourMinSecToSeconds(string hour)
        {
            try
            {
                string[] hourAndMin = hour.Split(":");
                int sum = Int32.Parse(hourAndMin[0]) * 3600 + Int32.Parse(hourAndMin[1]) *60 + Int32.Parse(hourAndMin[2]);
                return sum;
            }
            catch (Exception e)
            {
                return 0;
            }
        }
    }
}
