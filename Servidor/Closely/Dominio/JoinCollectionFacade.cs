using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dominio
{
    public class JoinCollectionFacade<TEntity, TOtherEntity, TJoinEntity> : ICollection<TEntity>
        where TJoinEntity : IJoinEntity<TEntity>, IJoinEntity<TOtherEntity>, new()
    {
        private readonly TOtherEntity _ownerEntity;
        private readonly ICollection<TJoinEntity> _collection;

        public JoinCollectionFacade(
            TOtherEntity ownerEntity,
            ICollection<TJoinEntity> collection)
        {
            _collection = collection;
            _ownerEntity = ownerEntity;
        }


        public int Count => _collection.Count;

        public bool IsReadOnly => _collection.IsReadOnly;

        public void Add(TEntity item)
        {
            var entity = new TJoinEntity();
            ((IJoinEntity<TEntity>)entity).Navigation = item;
            ((IJoinEntity<TOtherEntity>)entity).Navigation = _ownerEntity;
            _collection.Add(entity);
        }

        public void Clear()
        {
            _collection.Clear();
        }

        public bool Contains(TEntity item)
        {
            return _collection.Any(e => Equals(item, e));
        }

        public void CopyTo(TEntity[] array, int arrayIndex)
        {
            this.ToList().CopyTo(array, arrayIndex);
        }

        public IEnumerator<TEntity> GetEnumerator()
        {
            return _collection.Select(e => ((IJoinEntity<TEntity>)e).Navigation).GetEnumerator();
        }

        public bool Remove(TEntity item)
        {
            return _collection.Remove(_collection.FirstOrDefault(e => Equals(item, e)));
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        private static bool Equals(TEntity item, TJoinEntity e)
        {
            return ((IJoinEntity<TEntity>)e).Navigation.Equals(item);
        }
    }
}
