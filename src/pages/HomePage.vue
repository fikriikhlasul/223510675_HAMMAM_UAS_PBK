<template>
    <q-page padding>
        <q-btn @click="showAddCityModal = true" color="primary" icon="add" label="Add City" class="q-mb-md" />

        <q-dialog v-model="showAddCityModal">
            <q-card>
                <q-card-section>
                    <div class="text-h6">Add City</div>
                </q-card-section>
                <q-card-section>
                    <q-input v-model="newCity" label="City Name" />
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    <q-btn flat label="Add" color="primary" @click="addCity" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <div v-if="loading" class="city-grid">
            <q-skeleton v-for="n in skeletonCount" :key="n" class="q-mt-sm my-card" height="300px" square />
        </div>
        <div v-if="!loading" class="city-grid">
            <q-card v-for="(city, index) in cities" :key="index" class="q-mt-sm my-card" flat bordered>
                <div class="video-container">
                    <video class="video-background" autoplay loop muted>
                        <source :src="chooseVideo(city.weather?.description, city.weather?.timezone)" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <div class="overlay"></div>
                    <div class="content">
                        <div class="text-overline">Weather</div>
                        <div class="text-h5 q-mt-sm q-mb-xs">{{ city.city }}</div>
                        <div class="text-caption text-white">
                            {{ capitalizeFirstLetter(city.weather?.description) }}
                            <br />
                            {{ city.weather?.temp !== undefined ? `${city.weather.temp} °C` : '' }}
                            <br />
                            {{ city.weather.timezone == null ? 'null' : isDaytime(city.weather.timezone) ? 'Daylight' :
                                'Night' }}
                        </div>
                    </div>
                    <div class="actions-wrapper">
                        <q-card-actions class="actions">
                            <q-btn flat round icon="edit" color="primary" @click="editCity(index)" />
                            <q-btn flat round icon="delete" color="negative" @click="deleteCity(index)" />
                        </q-card-actions>
                    </div>
                </div>
            </q-card>
        </div>

        <q-dialog v-model="showEditCityModal">
            <q-card>
                <q-card-section>
                    <div class="text-h6">Edit City</div>
                </q-card-section>
                <q-card-section>
                    <q-input v-model="editCityName" label="City Name" />
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    <q-btn flat label="Save" color="primary" @click="updateCity" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script>
import { db } from 'src/firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default {
    name: 'HomePage',
    data() {
        return {
            loading: true,
            showAddCityModal: false,
            showEditCityModal: false,
            newCity: '',
            editCityName: '',
            cities: [],
            editCityIndex: null,
            skeletonCount: 3,
        };
    },
    async mounted() {
        await this.fetchCities();
    },
    methods: {
        async fetchCities() {
            this.loading = true;
            try {
                const querySnapshot = await getDocs(collection(db, 'cities'));
                const cities = [];
                querySnapshot.forEach((doc) => {
                    const city = doc.data();
                    city.id = doc.id;
                    cities.push(city);
                });
                this.skeletonCount = cities.length;
                for (const city of cities) {
                    if (city.city) {
                        const weather = await this.fetchWeather(city.city);
                        city.weather = weather;
                    } else {
                        console.error('City name is undefined:', city);
                    }
                }
                this.cities = cities;
            } catch (error) {
                console.error('Error fetching cities:', error);
            } finally {
                this.loading = false;
            }
        },
        isDaytime(timezoneOffset) {
            const currentUtc = new Date().getTime();
            const localTime = currentUtc + timezoneOffset * 1000;
            const hours = new Date(localTime).getUTCHours();
            return hours >= 6 && hours < 18;
        },
        chooseVideo(description, timezoneOffset) {
            const isDay = this.isDaytime(timezoneOffset);

            let videoTitle;
            switch (description.toLowerCase()) {
                case 'light intensity drizzle':
                case 'drizzle':
                case 'heavy intensity drizzle':
                case 'light intensity drizzle rain':
                case 'drizzle rain':
                case 'heavy intensity drizzle rain':
                case 'shower rain and drizzle':
                case 'heavy shower rain and drizzle':
                case 'shower drizzle':
                    videoTitle = isDay ? 'drizzle_d.mp4' : 'drizzle_n.mp4';
                    break;
                case 'clear sky':
                    videoTitle = isDay ? 'clearsky_d.mp4' : 'clearsky_n.mp4';
                    break;
                case 'few clouds':
                    videoTitle = isDay ? 'fewclouds_d.mp4' : 'fewclouds_n.mp4';
                    break;
                case 'scattered clouds':
                    videoTitle = isDay ? 'scatteredclouds_d.mp4' : 'scatteredclouds_n.mp4';
                    break;
                case 'broken clouds':
                    videoTitle = isDay ? 'brokenclouds_d.mp4' : 'brokenclouds_n.mp4';
                    break;
                case 'overcast clouds':
                    videoTitle = isDay ? 'overcastclouds_d.mp4' : 'overcastclouds_n.mp4';
                    break;
                case 'shower rain':
                case 'heavy intensity rain':
                case 'very heavy rain':
                case 'extreme rain':
                case 'freezing rain':
                case 'light intensity shower rain':
                case 'heavy intensity shower rain':
                case 'ragged shower rain':
                    videoTitle = isDay ? 'showerrain_d.mp4' : 'showerrain_n.mp4';
                    break;
                case 'rain':
                case 'light rain':
                case 'moderate rain':
                    videoTitle = isDay ? 'rain_d.mp4' : 'rain_n.mp4';
                    break;
                case 'thunderstorm with light rain':
                case 'thunderstorm with rain':
                case 'thunderstorm with heavy rain':
                case 'light thunderstorm':
                case 'thunderstorm':
                case 'heavy thunderstorm':
                case 'ragged thunderstorm':
                case 'thunderstorm with light drizzle':
                case 'thunderstorm with drizzle':
                case 'thunderstorm with heavy drizzle':
                    videoTitle = isDay ? 'thunderstorm_d.mp4' : 'thunderstorm_n.mp4';
                    break;
                case 'light snow':
                case 'snow':
                case 'heavy snow':
                case 'sleet':
                case 'light shower sleet':
                case 'shower sleet':
                case 'light rain and snow':
                case 'rain and snow':
                case 'light shower snow':
                case 'shower snow':
                case 'heavy shower snow':
                    videoTitle = isDay ? 'snow_d.mp4' : 'snow_n.mp4';
                    break;
                case 'mist':
                case 'smoke':
                case 'haze':
                case 'sand/dust whirls':
                case 'fog':
                case 'sand':
                case 'dust':
                case 'volcanic ash':
                case 'squalls':
                case 'tornado':
                    videoTitle = isDay ? 'mist_d.mp4' : 'mist_n.mp4';
                    break;
                default:
                    videoTitle = 'default.mp4';
                    break;
            }

            return `/videos/${videoTitle}`;
        },
        async fetchWeather(cityName) {
            console.log('Fetching weather for:', cityName);
            try {
                const APIkey = '0615d5663292100951ccefe2ae70dc1f';
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${APIkey}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (data.weather && data.weather.length > 0) {
                    return {
                        description: data.weather[0].description,
                        temp: data.main.temp,
                        timezone: data.timezone,
                    };
                } else {
                    console.error('No weather data available for', cityName);
                    return {
                        description: 'No weather data available',
                        temp: null,
                        timezone: null,
                    };
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
                return {
                    description: 'Error fetching weather data',
                    temp: null,
                    timezone: null,
                };
            }
        },
        capitalizeFirstLetter(str) {
            if (!str) return '';
            return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        },
        async addCity() {
            if (!this.newCity) return;
            try {
                await addDoc(collection(db, 'cities'), { city: this.newCity });
                this.newCity = '';
                this.showAddCityModal = false;
                await this.fetchCities();
            } catch (error) {
                console.error('Error adding city:', error);
            }
        },
        async editCity(index) {
            this.editCityIndex = index;
            this.editCityName = this.cities[index].city;
            this.showEditCityModal = true;
        },
        async updateCity() {
            if (this.editCityIndex === null) return;
            const city = this.cities[this.editCityIndex];
            try {
                await updateDoc(doc(db, 'cities', city.id), { city: this.editCityName });
                this.cities[this.editCityIndex].city = this.editCityName;
                this.showEditCityModal = false;
                this.editCityName = '';
                this.editCityIndex = null;
                await this.fetchCities();
            } catch (error) {
                console.error('Error updating city:', error);
            }
        },
        async deleteCity(index) {
            const city = this.cities[index];
            try {
                await deleteDoc(doc(db, 'cities', city.id));
                this.cities.splice(index, 1);
                await this.fetchCities();
            } catch (error) {
                console.error('Error deleting city:', error);
            }
        },
    },
};
</script>

<style scoped>
.city-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.my-card {
    width: calc(33.333% - 16px);
    position: relative;
    overflow: hidden;
    border: 1px solid #ccc;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease;
}

.video-container {
    position: relative;
    width: 100%;
    height: 300px;
    border-radius: 8px;
    overflow: hidden;
}

.video-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
}

.content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 16px;
    color: white;
}

.actions-wrapper {
    position: absolute;
    bottom: 16px;
    right: 16px;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.actions {
    display: flex;
    gap: 8px;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 4px;
    border-radius: 4px;
}

.my-card:hover .actions-wrapper {
    opacity: 1;
}

@media (max-width: 600px) {
    .my-card {
        width: 100%;
    }
}
</style>
