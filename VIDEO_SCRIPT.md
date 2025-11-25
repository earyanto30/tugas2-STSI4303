# Script Video: Penjelasan Tugas 2 - STSI4303
## Durasi: 15 Menit
## Bahasa: Indonesia

---

## BAGIAN 1: PENDAHULUAN (1 Menit)

**[Salam dan Pembukaan]**

Assalamualaikum, selamat datang di video penjelasan Tugas 2 STSI4303. Saya akan menjelaskan secara detail tentang komponen Vue.js yang telah saya buat untuk mengambil data cuaca dari API dan menampilkannya dalam bentuk tabel.

Di video ini, kita akan membahas dua bagian utama:
1. **Template** - bagian visual yang akan ditampilkan ke pengguna
2. **Script** - bagian logika yang menangani pengambilan dan pemrosesan data

Mari kita mulai!

---

## BAGIAN 2: STRUKTUR TEMPLATE (5 Menit)

## BAGIAN 2: STRUKTUR TEMPLATE (5 Menit)

**[Menampilkan File TemperaturePage.vue]**

Mari kita lihat bagian template secara detail, fokus pada dua hal utama: error state dan foreach loop.

### 2.1 Error State Handling

**Baris 16-21: Handling Loading dan Error**
```html
                <ion-card-content>
                    <ion-progress-bar 
                        v-if="loading" 
                        type="indeterminate">
                    </ion-progress-bar>
                    <ion-text v-else-if="error" color="danger">
                        <p>Error loading data: {{ error.message }}</p>
                    </ion-text>
```

**Penjelasan Error State:**

Ini adalah conditional rendering menggunakan Vue directives:

- `v-if="loading"`: Jika `loading` bernilai `true`, tampilkan progress bar
  - Ketika aplikasi sedang mengambil data dari API, progress bar akan muncul
  - User tahu bahwa aplikasi sedang loading, bukan hang/error

- `v-else-if="error"`: Jika tidak sedang loading DAN ada error, tampilkan pesan error
  - Jika ada error saat fetch data (network error, server error, dll), condition ini akan true
  - Tampilkan pesan error dengan warna merah (`color="danger"`)
  - `{{ error.message }}`: Menampilkan pesan error yang spesifik dari error object

**Alur Logic:**
```
IF loading = true
  → Tampilkan progress bar (user tunggu sebentar)
ELSE IF error ada
  → Tampilkan pesan error (sesuatu error terjadi)
ELSE
  → Tampilkan tabel dengan data (semuanya OK)
```

### 2.2 ForEach Loop - v-for

**Baris 45-54: Data Rows dengan v-for**
```html
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
```

**Penjelasan v-for Loop:**

`v-for` adalah Vue directive untuk iterasi/looping array:

- `v-for="row in temperatureRows"`: 
  - Loop setiap item dalam array `temperatureRows`
  - Variabel `row` merepresentasikan satu item saat ini dalam iterasi
  - Ini seperti `for (let row of temperatureRows)` di JavaScript

- `:key="row.index"`:
  - Vue identifier unik untuk setiap baris
  - Penting untuk performance dan kebenaran rendering
  - Ketika data berubah, Vue tahu element mana yang berubah dengan `:key`

**Contoh Iterasi:**
Jika `temperatureRows` berisi:
```javascript
[
  { index: 0, time: "2024-11-25T12:00", temperature: 28 },
  { index: 1, time: "2024-11-25T13:00", temperature: 29 },
  { index: 2, time: "2024-11-25T14:00", temperature: 30 }
]
```

Maka `v-for` akan membuat 3 `<ion-row>`:

**Iterasi 1:** `row = { index: 0, time: "2024-11-25T12:00", temperature: 28 }`
```html
<ion-row>
  <ion-col>2024-11-25, 12:00:00</ion-col>
  <ion-col>28°C</ion-col>
</ion-row>
```

**Iterasi 2:** `row = { index: 1, time: "2024-11-25T13:00", temperature: 29 }`
```html
<ion-row>
  <ion-col>2024-11-25, 13:00:00</ion-col>
  <ion-col>29°C</ion-col>
</ion-row>
```

**Iterasi 3:** `row = { index: 2, time: "2024-11-25T14:00", temperature: 30 }`
```html
<ion-row>
  <ion-col>2024-11-25, 14:00:00</ion-col>
  <ion-col>30°C</ion-col>
</ion-row>
```

**Data Binding dalam Loop:**
- `{{ new Date(row.time).toLocaleString() }}`: 
  - `row.time` adalah string waktu dari API (format ISO)
  - `new Date()`: Convert ke JavaScript Date object
  - `.toLocaleString()`: Format ke format tanggal/waktu lokal pengguna
  
- `{{ row.temperature }}°C`:
  - `row.temperature`: Akses property temperature dari object `row`
  - Tampilkan nilai + satuan °C

---

## BAGIAN 3: PENJELASAN SCRIPT SECTION (6 Menit)

**[Menampilkan Script Section]**

Sekarang mari kita bahas bagian script yang menangani logika aplikasi.

### 4.1 Import dan Type Definitions

**Baris 58-71: Import Components**
```typescript
import {
    IonPage, IonHeader, IonToolbar, IonTitle,
    IonContent, IonCard, IonCardHeader, 
    IonCardSubtitle, IonCardContent,
    IonGrid, IonRow, IonCol,
    IonText, IonProgressBar
} from "@ionic/vue";
```

- Mengimport semua komponen Ionic yang digunakan di template
- Setiap komponen harus di-import untuk bisa digunakan di template

### 4.2 Type Interfaces

**Baris 73-84: Interface Definitions**
```typescript
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
```

Penjelasan setiap interface:

**HourlyData Interface:**
- `time: string[]`: Array berisi waktu dalam format ISO (misal: "2024-11-25T12:00")
- `temperature_2m: number[]`: Array berisi suhu dalam satuan Celsius

**ApiResponse Interface:**
- `hourly: HourlyData`: Response dari API memiliki property `hourly` yang berisi data per jam

**TemperatureRow Interface:**
- `index: number`: Nomor urut baris
- `time: string`: Waktu dari API
- `temperature: number`: Suhu dari API

Interfaces ini membantu TypeScript memberikan autocompletion dan type checking.

### 4.3 Export Default Component

**Baris 86-100: Definisi Component**
```typescript
export default {
    name: "TemperaturePage",
    components: {
        IonPage, IonHeader, IonToolbar, IonTitle,
        IonContent, IonCard, IonCardHeader,
        IonCardSubtitle, IonCardContent,
        IonGrid, IonRow, IonCol,
        IonText, IonProgressBar,
    },
```

- `name: "TemperaturePage"`: Nama component untuk debugging dan vue devtools
- `components: {...}`: Daftarkan semua komponen yang digunakan agar bisa digunakan di template

### 4.4 Data State

**Baris 101-108: Data Properties**
```typescript
    data() {
        return {
            loading: false,
            error: null as Error | null,
            temperatureRows: [] as TemperatureRow[],
        };
    },
```

Penjelasan setiap state:

- `loading: false`: Flag untuk menunjukkan apakah sedang loading data
  - `true`: Sedang mengambil data (tampilkan progress bar)
  - `false`: Selesai mengambil data (tampilkan tabel atau error)

- `error: null as Error | null`: Menyimpan object error jika ada
  - `null`: Tidak ada error
  - `Error object`: Ada error, tampilkan pesan error

- `temperatureRows: [] as TemperatureRow[]`: Array berisi data suhu yang sudah diproses
  - Awalnya kosong, diisi setelah API merespons
  - Tipe `TemperatureRow[]` untuk type safety

### 4.5 Lifecycle Hook - Mounted

**Baris 109-111: Mounted Hook**
```typescript
    mounted() {
        this.fetchData();
    },
```

- `mounted()`: Lifecycle hook yang dipanggil ketika component sudah dimounting di DOM
- Memanggil `this.fetchData()` untuk mengambil data langsung saat halaman terbuka
- Ini memastikan data langsung ditampilkan kepada pengguna saat aplikasi dibuka

### 4.6 Method: fetchData

**Baris 112-131: Fetch Data dari API**
```typescript
    async fetchData() {
        try {
            this.loading = true;
            const response = await fetch(
                "https://api.open-meteo.com/v1/forecast?" +
                "latitude=-6.2&longitude=106.8&hourly=temperature_2m"
            );
            const data = await response.json();
            this.processData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            this.error = error as Error;
        } finally {
            this.loading = false;
        }
    }
```

**Penjelasan detailed:**

- `async fetchData()`: Fungsi async untuk operasi asynchronous (menunggu response dari API)

- `try {...}`: Blok untuk operasi normal
  - `this.loading = true`: Set loading true, sehingga progress bar akan muncul di template

  - `const response = await fetch(...)`: 
    - Fetch data dari Open-Meteo API (API gratis untuk cuaca)
    - Koordinat: latitude -6.2, longitude 106.8 (Jakarta, Indonesia)
    - Parameter `hourly=temperature_2m` untuk mendapatkan suhu per jam
    - `await`: Tunggu hingga response diterima
    - Ini adalah HTTP GET request

  - `const data = await response.json()`:
    - Convert response ke format JSON
    - `await`: Tunggu parsing selesai

  - `this.processData(data)`:
    - Proses data yang diterima untuk ditampilkan di template

- `catch (error) {...}`: Blok jika ada error
  - `console.error()`: Log error ke console untuk debugging
  - `this.error = error as Error`: Simpan error object ke state, sehingga akan ditampilkan di template

- `finally {...}`: Blok yang selalu dijalankan setelah try/catch
  - `this.loading = false`: Set loading false, progress bar akan hilang

### 4.7 Method: processData

**Baris 132-147: Process Data**
```typescript
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
    }
```

**Penjelasan:**

- `if (data?.hourly)`: Optional chaining, cek apakah `data.hourly` ada
  - `?`: Jika undefined/null, skip blok ini

- `data.hourly.time.map(...)`: Menggunakan array `map()` method
  - `map()` mengubah setiap item array menjadi bentuk lain
  - Di sini mengubah dari API response format ke format `TemperatureRow`

- `(time, index) => ({...})`: Arrow function
  - `time`: Waktu dari array time
  - `index`: Nomor urut (0, 1, 2, ...)
  - Return object dengan struktur TemperatureRow

- `index`: Copy index langsung
- `time`: Copy time langsung
- `temperature: data!.hourly.temperature_2m[index]`:
  - `!`: Non-null assertion, katakan ke TypeScript bahwa ini pasti tidak null
  - Ambil suhu dari array temperature_2m menggunakan index yang sama

**Contoh:**
```
Input API:
{
  hourly: {
    time: ["2024-11-25T12:00", "2024-11-25T13:00", ...],
    temperature_2m: [28, 29, ...]
  }
}

Output temperatureRows:
[
  { index: 0, time: "2024-11-25T12:00", temperature: 28 },
  { index: 1, time: "2024-11-25T13:00", temperature: 29 },
  ...
]
```

## BAGIAN 4: ALUR PROGRAM (1 Menit)

**[Flow Diagram]**

Mari summarize alur program secara menyeluruh:

1. **User membuka aplikasi**
   ↓
2. **Component di-mount** → `mounted()` dipanggil
   ↓
3. **`fetchData()` dipanggil**
   - Set `loading = true`
   - Kirim request ke API
   ↓
4. **Template menampilkan progress bar** (karena `loading = true`)
   ↓
5. **API merespons dengan data**
   - Call `processData()`
   - Transform data ke format TemperatureRow
   ↓
6. **Set `loading = false`**
   ↓
7. **Template menampilkan tabel** dengan data suhu
   ↓
8. **User bisa melihat data cuaca per jam**

Jika terjadi error di step 3-5:
- Error ditangkap di `catch` block
- `this.error` di-set dengan error object
- Template menampilkan pesan error

## BAGIAN 5: KEUNTUNGAN PENDEKATAN INI (0.5 Menit)

**[Keuntungan Design]**

Mengapa structure kode ini bagus?

1. **Separation of Concerns**: Template, logic, dan styling terpisah
2. **Type Safe**: TypeScript interfaces membantu catch bugs
3. **Responsive Loading**: User tahu aplikasi sedang loading dengan progress bar
4. **Error Handling**: Jika ada error, user akan tahu bukannya aplikasi hang
5. **Clean Code**: Mudah dibaca dan di-maintain
6. **Ionic Components**: Konsisten dengan design system Ionic

## BAGIAN 6: PENUTUP (0.5 Menit)

**[Kesimpulan]**

Jadi, aplikasi Tugas 2 STSI4303 ini:

✓ Mengambil data cuaca real-time dari Open-Meteo API
✓ Menampilkan suhu per jam dalam format tabel rapi
✓ Menggunakan Ionic Framework untuk UI yang modern
✓ Menangani loading state dan error dengan baik
✓ Menggunakan Vue.js 3 dengan TypeScript untuk code yang robust

Template-nya menggunakan Ionic components untuk konsistensi design, dan script-nya menghandle semua logika data fetching dan processing.

Terima kasih telah menonton video ini. Semoga penjelasan ini membantu kalian memahami cara kerja aplikasi ini. Jika ada pertanyaan, silakan tanyakan di comments section. Sampai jumpa!

---

## NOTES UNTUK PRESENTER:

**Timeline Breakdown:**
- Part 1 (Pendahuluan): 1 min
- Part 2 (Ionic Framework): 2 min
- Part 3 (Template): 5 min
- Part 4 (Script): 6 min
- Part 5 (Alur Program): 1 min
- Part 6 (Keuntungan): 0.5 min
- Part 7 (Penutup): 0.5 min
**Total: ~15 menit**

**Visual Assets yang diperlukan:**
- Screenshot dari file TemperaturePage.vue (full file)
- Screenshot template section dengan highlight
- Screenshot script section dengan highlight
- Flow diagram alur program
- Comparison API response vs processed data
- Screen recording aplikasi berjalan

**Tips Recording:**
- Gunakan font besar agar jelas di video
- Slow down penjelasan, jangan terlalu cepat
- Highlight code yang sedang dijelaskan
- Gunakan cursor untuk menunjuk bagian penting
- Buat demo aplikasi berjalan di akhir

