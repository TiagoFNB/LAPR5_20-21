namespace DDDSample1.Domain.Shared
{
    /// <summary>
    /// Base class for entities.
    /// </summary>
    public abstract class DataSchema<TDataSchemaId>
    where TDataSchemaId : DataSchemaId
    {
         public TDataSchemaId Id { get;  protected set; }
    }
}