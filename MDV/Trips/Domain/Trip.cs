
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DDDNetCore.Trips.Domain.ValueObjects;
using DDDNetCore.WorkBlocks.Domain;
using DDDSample1.Domain.Shared;

namespace DDDNetCore.Trips.Domain
{
    public class Trip : Entity<TripKey>, IAggregateRoot
    {
        public PathId Path { get; private set; }

        public LineId Line { get; private set; }

        public List<PassingTime> PassingTimes { get; private set; }

        public ICollection<WorkBlock> WorkBlocks { get; set; }

        /**
         * Constructor for trip
         */
        public Trip(string pathId, string line, List<int> passingTimes)
        {
            this.Id = new TripKey(Guid.NewGuid());

            this.Path = new PathId(pathId);

            this.Line = new LineId(line);

            this.PassingTimes = new List<PassingTime> { };
            foreach (var value in passingTimes)
            {
                this.PassingTimes.Add(new PassingTime(value));
            }
            this.Validation();
            this.WorkBlocks = new List<WorkBlock>();
        }

        public Trip(string key, string pathId, string line, List<int> passingTimes)
        {
            
            this.Id = new TripKey(key);

            this.Path = new PathId(pathId);

            this.Line = new LineId(line);

            this.PassingTimes = new List<PassingTime>{};
            foreach (var value in passingTimes)
            {
                this.PassingTimes.Add(new PassingTime(value));
            }
            this.Validation();
            
            this.WorkBlocks = new List<WorkBlock>();
        }

        private Trip()
        {
        }

        private void Validation()
        {
            if (this.PassingTimes.Count == 0)
            {
                throw new InvalidOperationException("Passing time cant be null.");
            }

        }

    }
}
