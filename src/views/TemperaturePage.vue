<template>
    <div class="temperature-container">
        <div class="content-wrapper">
            <div class="header-section">
                <h1 class="title">Tugas 2 - STSI4303</h1>
                <p class="description">
                    Mengambil data dari API OpenWeatherMap dan menampilkan dalam
                    bentuk tabel.
                </p>
            </div>
            <div class="content-section">
                <ion-spinner v-if="loading"></ion-spinner>
                <ion-text v-else-if="error" color="danger">
                    <p>Error loading data: {{ error.message }}</p>
                </ion-text>
                <table v-else class="temperature-table">
                    <thead>
                        <tr class="header-row">
                            <th>Time</th>
                            <th>Temperature</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in temperatureRows"
                            :key="row.index"
                            class="data-row"
                        >
                            <td>{{ new Date(row.time).toLocaleString() }}</td>
                            <td>{{ row.temperature }}°C</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IonSpinner, IonText } from "@ionic/vue";

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
        IonSpinner,
        IonText,
    },
    data() {
        return {
            apiData: null as ApiResponse | null,
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
                this.apiData = data;
                this.processData();
            } catch (error) {
                console.error("Error fetching data:", error);
                this.error = error as Error;
            } finally {
                this.loading = false;
            }
        },
        // process data dari api
        processData() {
            if (this.apiData?.hourly) {
                this.temperatureRows = this.apiData.hourly.time.map(
                    (time, index) => ({
                        index,
                        time,
                        temperature: this.apiData!.hourly.temperature_2m[index],
                    }),
                );
            }
        },
    },
};
</script>

<style scoped>
.temperature-container {
    padding: 16px;
    margin: 16px 0;
    cursor: url("https://ionicframework.com/img/finger.png"), auto;
}

.content-wrapper {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.header-section {
    padding: 24px;
    border-bottom: 1px solid #e0e0e0;
    text-align: center;
}

.title {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
    color: #333;
}

.description {
    margin: 0;
    font-size: 14px;
    color: #666;
}

.content-section {
    padding: 24px;
    max-height: 500px;
    overflow-y: auto;
    border: 1px solid #e0e0e0;
}

.temperature-table {
    width: 100%;
    border-collapse: collapse;
}

.temperature-table thead {
    background-color: lightgrey;
}

.header-row {
    font-weight: 600;
    color: #333;
}

.header-row th {
    padding: 12px;
    text-align: center;
    font-size: 14px;
    border: solid 1px grey;
    border-bottom-style: none;
    border-right-style: none;
}

.header-row th:last-child {
    border-right: solid 1px grey;
}

.data-row td {
    padding: 12px;
    text-align: center;
    font-size: 14px;
    color: #555;
    border: solid 1px grey;
    border-bottom-style: none;
    border-right-style: none;
}

.data-row td:last-child {
    border-right: solid 1px grey;
}

.data-row:last-child td {
    border-bottom: solid 1px grey;
}

.data-row:hover {
    background-color: #fafafa;
}
</style>
