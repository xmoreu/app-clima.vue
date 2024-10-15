import axios from "axios"
import { computed, ref } from "vue"
export default function useClima() {
    const clima=ref({})
    const spinner=ref(false)
    const error=ref('')
    const obtenerClima = async({ ciudad, pais }) => {
        //Importar el api key
        const key = import.meta.env.VITE_API_KEY
        //Obtener la lat y long

        error.value=''
        clima.value=[]
        try {
            spinner.value=true
            const url = `https://api.openweathermap.org/geo/1.0/direct?q=${ciudad},${pais}&limit=1&appid=${key}`
            const {data}=await axios(url)
            console.log(data)
            const {lat,lon}=data[0]
            //Obtener clima
            const urlClima=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${ key}`
            const {data:resultado}=await axios(urlClima)
            clima.value=resultado
            console.log("T "+clima.value.main.temp)
            spinner.value=false

        } catch (e) {
            spinner.value=false
            error.value="Ciudad no encontrada"       
         }
    }        
    const mostrarClima=computed(()=>{
        console.log(Object.values(clima.value).length)
        return Object.values(clima.value).length>0
    })
    const formatearTemperatura=temperatura=>parseInt(temperatura-273.15)
    
    return {
        obtenerClima,
        clima,
        mostrarClima,
        formatearTemperatura,
        spinner,
        error
    }
}