let weatherCode ={
    0: {
        logo: 'sun.png',
        deskripsi: 'Cerah',
    },
    1: {
        logo:'clear-sky.png',
        deskripsi:'Langit cerah',
    },
    2: {
        logo:'cloud.png',
        deskripsi:'Berawan',
    },
    3: {
        logo: 'overcast.png',
        deskripsi: 'Mendung',
    },
    45:{        
        logo:'fog (3).png',
        deskripsi:'Berkabut',
    },
    48:{        
        logo:'fog (3).png',
        deskripsi:'Berkabut',
    },
    51:{        
        logo:'drizzle.png',
        deskripsi:'Gerimis ringan',
    },
    53:{        
        logo:'drizzle.png',
        deskripsi:'Gerimis sedang',
    },
    55:{        
        logo:'drizzle.png',
        deskripsi:'Gerimis padat',
    },
    61:{        
        logo:'rain.png',
        deskripsi:'Hujan',
    },
    63:{        
        logo:'rain.png',
        deskripsi:'Hujan',
    },
    65:{        
        logo:'rain.png',
        deskripsi:'Hujan',
    },
    80:{        
        logo:'heavy-rain.png',
        deskripsi:'Hujan lebat',
    },
    81:{        
        logo:'heavy-rain.png',
        deskripsi:'Hujan lebat',
    },
    82:{        
        logo:'heavy-rain.png',
        deskripsi:'Hujan lebat',
    },
    95:{        
        logo:'strom1.png',
        deskripsi:'Badai petir',
    },
    96:{        
        logo:'strom1.png',
        deskripsi:'Badai petir',
    },
}

let loadingElement = document.querySelector(".loading")
let form = document.querySelector(".search")
form.addEventListener('submit', async(event) => {
    event.preventDefault();
    console.log(event.target[0].value);
    try {
        loadingElement.style.display = "block";
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${event.target[0].value}&count=10&language=en&format=json`
        );
        const result = await response.json();
        current(result.results[1]);
        fetchCuaca(result.results[1]);
    } catch (error){
        console.log(error)
    }finally {
        loadingElement.style.display = "none";
    }
})

async function current(dataCity){
    try{
        let latitude = "-6.1818";
        let longitude ="106.8223";

        if (dataCity){
            latitude = dataCity.latitude;
            longitude = dataCity.longitude;
        }

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max&timezone=Asia%2FBangkok&forecast_days=3`);
        const result = await response.json();

        hourly(result)

        const cardTime = document.querySelector(".time");
        cardTime.innerHTML = new Date(result.current.time).toLocaleDateString("id-ID",{
            weekday:"long",
            year:"numeric",
            month:"long",
            day: "numeric",
            hour: "numeric",
            minute:"numeric",
            timeZoneName:"short",
        })

        if (dataCity){
            const cardCity = document.querySelector(".city")
            cardCity.innerHTML = dataCity.name
            const iconDelete = document.querySelector(".iconToday");
            iconDelete.remove();
            const windDelete = document.querySelector(".textWind");
            windDelete.remove();
            const humidityDelete = document.querySelector(".textHumidity");
            humidityDelete.remove();
            const todayDelete = document.querySelector(".textToday");
            todayDelete.remove();
            const deskripsiDelete = document.querySelector(".textDeskripsi");
            deskripsiDelete.remove();
        }

        const cardIcon = document.createElement("img");
        cardIcon.classList.add("iconToday");
        cardIcon.setAttribute('src', weatherCode[result.current.weather_code].logo);
        cardIcon.setAttribute('height', '150px');
        cardIcon.setAttribute('width', '200px');

        const todayCuaca = document.querySelector(".todayCuaca");
        todayCuaca.append(cardIcon);

        const currentToday = document.createElement("p");
        currentToday.classList.add("textToday");
        currentToday.innerHTML = result.current.temperature_2m + "°C"
        todayCuaca.append(currentToday);

        const currentDeskripsi = document.createElement("p");
        currentDeskripsi.classList.add("textDeskripsi");
        currentDeskripsi.innerHTML = weatherCode[result.current.weather_code].deskripsi;
        todayCuaca.append(currentDeskripsi);

        const cardWind = document.createElement("p");
        cardWind.classList.add("textWind");
        cardWind.innerHTML = result.current.wind_speed_10m + "km/h"
        const currentWind = document.querySelector(".wind");
        currentWind.append(cardWind);

        const cardHumidity = document.createElement("p");
        cardHumidity.classList.add("textHumidity");
        cardHumidity.innerHTML = result.current.relative_humidity_2m + "%"
        const currentHumidity = document.querySelector(".humidity");
        currentHumidity.append(cardHumidity);

    }catch (error){
        console.log("error");
    }
}
async function hourly(result){
    try{
        const hourlyDelete = document.querySelector(".hourly");
        hourlyDelete.innerHTML = '';
        let jumlahDataTampil = 0
        result.hourly.time.forEach((el,i) => {
            const waktu = new Date(el).toLocaleTimeString("id-ID",{
                timeZoneName:"short",
                hour: "numeric",
                minute:"numeric",
            })
            const waktuSekarang = new Date().toLocaleTimeString("id-ID",{
                timeZoneName:"short",
                hour: "numeric",
                minute:"numeric",
            })
            if (waktu < waktuSekarang || jumlahDataTampil > 6) {
                return
            }

            jumlahDataTampil++
            const card = document.createElement("p");
            card.classList.add("cardHourly");
            
            const cardText = document.createElement("p");
            cardText.innerHTML = waktu
            card.append(cardText);

            const hourlyTime = document.querySelector(".hourly")
            hourlyTime.append(card);

            const cardIcon = document.createElement("img");
            cardIcon.setAttribute('src', weatherCode[result.hourly.weather_code[i]].logo); 
            cardIcon.setAttribute('height', '40px');
            cardIcon.setAttribute('width', '40px');
            card.append(cardIcon);
            

            const hourlyToday = document.createElement("p");
            hourlyToday.classList.add("textHourly");
            hourlyToday.innerHTML = result.hourly.temperature_2m[i]+ "°C"
            card.append(hourlyToday);
        });

    }catch (error){
        console.log("error");
    }

}

async function fetchCuaca(city){
    try{
        const cuacaDelete = document.querySelector(".cuaca");
        cuacaDelete.innerHTML = '';

        let latitude = "-6.1818";
        let longitude ="106.8223";

        if (city){
            latitude = city.latitude;
            longitude = city.longitude;
        }
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max&timezone=Asia%2FBangkok`);
        const result = await response.json();

        result.daily.time.forEach((el,i) => {
            const card = document.createElement("p");
            card.classList.add("cardCuaca");

            const cardText = document.createElement("p");
            cardText.innerHTML = new Date(el).toLocaleDateString("id-ID",{
                weekday:"long",
                year:"numeric",
                month:"long",
                day: "numeric",
            })
            card.append(cardText);

            const cardIcon = document.createElement("img");
            cardIcon.setAttribute('src', weatherCode[result.daily.weather_code[i]].logo); 
            cardIcon.setAttribute('height', '60px');
            cardIcon.setAttribute('width', '60x');
            card.append(cardIcon);

            const cardTemperature = document.createElement("p");
            cardTemperature.innerHTML = result.daily.temperature_2m_max[i] + "°C"
            card.append(cardTemperature);

            const cardDeskripsi = document.createElement("p");
            cardDeskripsi.innerHTML = weatherCode[result.daily.weather_code[i]].deskripsi;
            card.append(cardDeskripsi);

            const elementCuaca = document.querySelector(".cuaca")
            elementCuaca.append(card);
        });
    } catch (error){
        console.log("error");
    }
}

current();
fetchCuaca();