using DDDNetCore.DriverDuties.Domain.ValueObjects;
using DDDNetCore.DriverDuties.Domain;
using DDDSample1.Domain.Shared;


namespace DDDNetCore.DriverDuties.Repository
{
    public interface IDriverDutyRepository : IRepository<DriverDuty,DriverDutyCode>
    {
    }
}
