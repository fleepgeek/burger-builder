import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-course.firebaseio.com/',
})

export default instance;