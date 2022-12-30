<template>
  <div v-if="dataLoaded" class="mx-auto max-w-7xl px-4 sm:px-6 mt-10">
    {{ errorMsg }}
    <div v-if="data.length === 0" class="w-full flex flex-col items-center">
      <h1 class="text-2xl">Looks empty here...</h1>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        class="flex justify-center text-left"
        v-for="paket in data"
        :key="paket.id"
      >
        <div class="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
          <h5 class="text-gray-900 text-2xl leading-tight font-medium mb-2">
            {{ paket.nama }}
          </h5>
          <p class="text-gray-700 text-base mb-4">
            Durasi pengerjaan: {{ paket.durasi }} - Harga: Rp.{{ paket.harga }}
          </p>
          <p class="text-gray-700 text-base mb-4">
            {{ paket.deskripsi }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import supabase from "../supabase/supabase";
import { ref } from "vue";

export default {
  name: "Home",
  components: {},
  setup() {
    const errorMsg = ref(null);
    const data = ref([]);
    const dataLoaded = ref(null);

    const getData = async () => {
      try {
        const { data: paket, error } = await supabase.from("paket").select("*");
        if (error) throw error;
        data.value = paket;
        dataLoaded.value = true;
      } catch (error) {
        errorMsg.value = error.message;
        setTimeout(() => {
          errorMsg.value = null;
        }, 5000);
      }
    };

    getData();

    return { data, dataLoaded, errorMsg };
  },
};
</script>
