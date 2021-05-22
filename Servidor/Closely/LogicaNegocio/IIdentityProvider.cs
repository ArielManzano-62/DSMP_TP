using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio
{
    public interface IIdentityProvider
    {
        void CreateUser(string email, string password, string nombre, string apellido);
        Task<bool> UserExistByEmail(string email);
        Task UpdateUser(string userId, string name, string lastname, string picture);
    }
}
