namespace DDDSample1.Domain.Shared
{
    public interface IValueObject
    {

        public  bool Equals(object obj);

        public  int GetHashCode();


    }
}