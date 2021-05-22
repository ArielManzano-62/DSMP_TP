using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace LogicaNegocio.Repositorio
{
    public interface IRepositorio<TEntity> where TEntity : class
    {
        //For retrieving data
        TEntity Get(params object[] keyValues);
        IEnumerable<TEntity> GetAll();
        IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate);

        //For saving new data (new rows)
        void Add(TEntity entity);
        void AddRange(IEnumerable<TEntity> entities);

        void Update(TEntity entity);

        //For removing data (rows)
        void Remove(TEntity entity);
        void Remove(params object[] keyValues);
        void RemoveRange(IEnumerable<TEntity> entities);
    }
}
