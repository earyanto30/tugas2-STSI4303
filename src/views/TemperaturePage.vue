<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title class="ion-text-center">Tugas 2 - STSI4303</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-card>
                <ion-card-header>
                    <ion-card-subtitle>
                        Mengambil data dari API OpenWeatherMap dan menampilkan dalam
                        bentuk tabel.
                    </ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                    <ion-progress-bar v-if="loading" type="indeterminate"></ion-progress-bar>
                    <ion-text v-else-if="error" color="danger">
                        <p>Error loading data: {{ error.message }}</p>
                    </ion-text>
                    <ion-grid v-else>
                        <ion-row>
                            <ion-col size="6" class="ion-text-center">
                                <ion-text>
                                    <strong>Time</strong>
                                </ion-text>
                            </ion-col>
                            <ion-col size="6" class="ion-text-center">
                                <ion-text>
                                    <strong>Temperature</strong>
                                </ion-text>
                            </ion-col>
                        </ion-row>
                        <ion-row
                            v-for="row in temperatureRows"
                            :key="row.index"
                        >
                            <ion-col size="6" class="ion-text-center">
                                {{ new Date(row.time).toLocaleString() }}
                            </ion-col>
                            <ion-col size="6" class="ion-text-center">
                                {{ row.temperature }}°C
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-card-content>
            </ion-card>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonProgressBar
} from "@ionic/vue";

interface HourlyData {
    time: string[];
    temperature_2m: number[];
}

interface ApiResponse {
    hourly: HourlyData;
}

interface TemperatureRow {
    index: number;
    time: string;
    temperature: number;
}

export default {
    name: "TemperaturePage",
    components: {
        IonPage,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonCard,
        IonCardHeader,
        IonCardSubtitle,
        IonCardContent,
        IonGrid,
        IonRow,
        IonCol,
        IonText,
        IonProgressBar,
    },
    data() {
        return {
            loading: false,
            error: null as Error | null,
            temperatureRows: [] as TemperatureRow[],
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        // get data dari api
        async fetchData() {
            try {
                // set loading true ketika get data
                this.loading = true;
                const response = await fetch(
                    "https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&hourly=temperature_2m",
                );
                const data = await response.json();
                this.processData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
                this.error = error as Error;
            } finally {
                // set lodaing ketika selesai get data
                this.loading = false;
            }
        },
        // process data dari api
        processData(data: ApiResponse) {
            if (data?.hourly) {
                this.temperatureRows = data.hourly.time.map(
                    (time, index) => ({
                        index,
                        time,
                        temperature: data!.hourly.temperature_2m[index],
                    }),
                );
            }
        },
    },
};
</script>
