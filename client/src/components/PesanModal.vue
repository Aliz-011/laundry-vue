<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="open = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              <div
                class="flex flex-col w-full px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10"
              >
                <div
                  class="self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white"
                >
                  Pesan
                </div>
                <div
                  v-show="errMsg"
                  class="bg-red-200 border-red-600 text-red-600 border-l-4 p-4"
                  role="alert"
                >
                  <p class="text-red-500">{{ errMsg }}</p>
                </div>
                <div class="mt-3">
                  <form action="#" autoComplete="off">
                    <div class="mb-2">
                      <div class="relative flex items-center space-x-4">
                        <label class="text-gray-700" for="animals">
                          Paket
                        </label>
                        <select
                          class="inline-flex w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          v-model="namaPaket"
                          required
                        >
                          <option value="">Select an option</option>
                          <option
                            v-for="(paket, index) in listPaket"
                            :key="index"
                            :value="paket.id"
                          >
                            {{ paket.nama }} - Rp.{{ paket.harga }}/Kg
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="flex flex-col mb-2">
                      <div class="flex relative items-center space-x-4">
                        <label>Berat</label>
                        <input
                          type="number"
                          class="rounded flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          placeholder="Berat(Kg) pakaian yang ini dilaundry"
                          v-model="beratPaket"
                          pattern="[0-9]+"
                          required
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div
                class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
              >
                <button
                  class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="addPesanan"
                >
                  Order
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="open = false"
                  ref="cancelButtonRef"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import supabase from "../supabase/supabase";

export default {
  name: "PesanModal",
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
  },
  props: ["listPaket"],
  data() {
    return {
      namaPaket: null,
      beratPaket: null,
      errMsg: null,
      open: true,
    };
  },
  methods: {
    async addPesanan() {
      const user = supabase.auth.user();
      if (!this.namaPaket || !this.beratPaket) {
        this.errMsg = "Input tidak boleh ada yg kosong!";
        setTimeout(() => {
          this.errMsg = null;
        }, 5000);
      } else if (this.beratPaket < 2) {
        this.errMsg = "Berat minimal harus 2 Kg!";
        setTimeout(() => {
          this.errMsg = null;
        }, 5000);
      } else {
        await supabase.from("pesanan").insert([
          {
            user_id: user.id,
            paket_id: this.namaPaket,
            berat: this.beratPaket,
          },
        ]);
        this.open = !this.open;
      }
    },
  },
};
</script>
