import axios from "axios";

const $port=axios.create({
    baseURL:import.meta.env.API_BASE_URL ||"http://localhost:5642",
    timeout:5000,
    // headers:{
    //     "Content-Type":"application/json"
    // }
});

//to add access toke to every request
$port.interceptors.request.use((config)=>{
    const accesstoken= localStorage.getItem("accesstoken");

    if (accesstoken) {
        config.headers.Authorization=`Bearer ${accesstoken}`;
    }
    return config;
},(error)=>{
    return Promise.reject(error);
}
)

export {$port};