export const enviarInvitiacion = (invitacion) =>{
    return {
        type: 'ENVIAR_INVITACION',
        payload: invitacion,
    }
}