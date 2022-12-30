<template>
  <div class="container mx-auto px-4 sm:px-8 max-w-3xl">
    <div v-if="showModal">
      <PesanModal :listPaket="listPaket" />
    </div>
    <div class="py-8">
      <div class="flex flex-row mb-1 sm:mb-0 justify-between w-full">
        <h2 class="text-2xl leading-tight">Pesanan</h2>
        <div class="text-end">
          <button
            @click="toggleModal"
            class="flex px-3 py-2 text-left font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200"
            type="submit"
          >
            <PlusCircleIcon class="w-6 h-6 mr-1" />
            Pesan
          </button>
        </div>
      </div>
      <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table class="min-w-full leading-normal">
            <thead>
              <tr>
                <th
                  scope="col"
                  class="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal"
                >
                  #
                </th>
                <th
                  scope="col"
                  class="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal"
                >
                  Paket
                </th>
                <th
                  scope="col"
                  class="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal"
                >
                  Berat Pakaian - Harga Paket
                </th>
                <th
                  scope="col"
                  class="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal"
                >
                  Total
                </th>
                <th
                  scope="col"
                  class="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal"
                >
                  status
                </th>
                <th
                  scope="col"
                  class="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal"
                ></th>
              </tr>
            </thead>
            <div v-if="data.length === 0" class="p-4">
              <p>Looks empty here...</p>
            </div>
            <tbody v-for="(pesanan, index) in data" :key="index">
              <tr>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ index + 1 }}
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ pesanan.paket.nama }}
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ pesanan.berat }}Kg - Rp.{{ pesanan.paket.harga }}
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    Rp.{{ pesanan.berat * pesanan.paket.harga }}
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span
                    class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
                  >
                    <span
                      aria-hidden="true"
                      class="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                    >
                    </span>
                    <span class="relative"> {{ pesanan.status }} </span>
                  </span>
                </td>
                <td
                  v-if="pesanan.status === 'Belum bayar'"
                  class="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                >
                  <router-link
                    :to="{ name: 'Detail', params: { id: pesanan.id } }"
                    class="text-indigo-600 cursor-pointer hover:text-indigo-900"
                  >
                    Bayar
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PlusCircleIcon } from "@heroicons/vue/24/outline";
import PesanModal from "./PesanModal.vue";
import { ref } from "@vue/reactivity";
import supabase from "../supabase/supabase";

export default {
  name: "PesananTable",
  props: ["data"],
  components: { PlusCircleIcon, PesanModal },
  data() {
    return {
      listPaket: [],
      errMsg: null,
    };
  },
  methods: {
    async fetchPaket() {
      try {
        const res = await supabase.from("paket").select("*");

        const data = res.data;
        return data;
      } catch (error) {
        this.errMsg = error.message;
      }
    },
  },
  async created() {
    const data = await this.fetchPaket();
    this.listPaket = data;
  },
  setup() {
    const showModal = ref(null);
    const toggleModal = () => {
      showModal.value = !showModal.value;
    };

    return { showModal, toggleModal };
  },
};
</script>
