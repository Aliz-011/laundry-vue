<template>
  <form class="container max-w-2xl mx-auto mt-10 shadow-md md:w-3/4">
    <input type="hidden" :value="this.$props.id" />
    <div
      class="p-4 bg-gray-100 border-t-2 border-indigo-400 rounded-lg bg-opacity-5"
    >
      <div class="max-w-sm md:w-full md:mx-0">
        <div class="inline-flex items-center">
          <h1 class="text-gray-600 font-semibold">
            {{ username[0].first_name }} {{ username[0].last_name }}
          </h1>
        </div>
      </div>
    </div>
    <div class="space-y-6 bg-white">
      <div
        class="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0"
      >
        <h2 class="max-w-sm mx-auto md:w-1/3">Paket</h2>
        <div class="max-w-sm mx-auto md:w-2/3">
          <div class="relative">
            <input
              type="text"
              disabled=""
              v-model="detailOrder.paket.nama"
              class="rounded-lg font-semibold opacity-50 cursor-not-allowed border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Email"
            />
          </div>
        </div>
      </div>
      <hr />
      <div
        class="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0"
      >
        <h2 class="max-w-sm mx-auto md:w-1/3">Detail Paket</h2>
        <div class="max-w-sm mx-auto space-y-5 md:w-2/3">
          <div>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <span class="text-gray-500 sm:text-sm"> Kg </span>
              </div>
              <input
                type="text"
                v-model="detailOrder.berat"
                class="focus:ring-indigo-500 border-l border-b border-t border-gray-300 py-2 px-5 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm rounded-md"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center opacity-50 cursor-not-allowed"
              >
                <span class="text-gray-500 sm:text-sm"> Rp. </span>
              </div>
              <input
                type="text"
                disabled
                v-model="detailOrder.paket.harga"
                class="focus:ring-indigo-500 border-l border-b border-t border-gray-300 py-2 px-4 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm rounded-md"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div
        class="items-center w-full p-8 space-y-4 text-gray-500 md:inline-flex md:space-y-0"
      >
        <h2 class="max-w-sm mx-auto md:w-4/12">Status Pembayaran</h2>
        <div
          class="w-full max-w-sm pl-2 mx-auto space-y-5 md:w-5/12 md:pl-9 md:inline-flex"
        >
          <div class="relative opacity-50 cursor-not-allowed">
            <input
              type="text"
              v-model="detailOrder.status"
              disabled=""
              class="rounded-lg font-semibold border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Your email"
            />
          </div>
        </div>
        <div class="text-center md:w-3/12 md:pl-6"></div>
      </div>
      <hr />
      <div class="w-full px-4 pb-4 ml-auto text-gray-500 md:w-1/3">
        <div
          @click="payOrder"
          id="payOrder"
          class="py-2 px-4 cursor-pointer bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
        >
          Pay!
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import supabase from "../supabase/supabase";
import Base64 from "midtrans-payment/src/base64";
import { useRouter } from "vue-router";

export default {
  name: "Order",
  props: ["id"],
  data() {
    return {
      detailOrder: null,
      username: null,
      statusMsg: null,
    };
  },
  methods: {
    async fetchOrder() {
      const res = await supabase
        .from("pesanan")
        .select(
          `
          id,
          berat,
          status,
          paket:paket_id (
              nama,
              durasi,
              harga
          )
        `
        )
        .eq("id", this.$props.id)
        .single();
      return res.data;
    },
    async loggedInUser() {
      const res = await supabase.from("profiles").select("*");
      return res.data;
    },
    async addToPembayaran() {
      const { data, error } = await supabase.from("pembayaran").insert([
        {
          pesanan_id: this.detailOrder.id,
          total: this.detailOrder.paket.harga * this.detailOrder.berat,
        },
      ]);

      if (error) throw error;
      return data.data;
    },
    async payPesanan() {
      const res = await fetch("http://localhost:3080/api/pesanan", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: new Base64(process.env.MIDTRANS_SERVER_KEY + ":"),
        },
        body: JSON.stringify({
          transaction_details: {
            order_id:
              "order-laundry-id-" + Math.round(new Date().getTime() / 1000),
            gross_amount: this.detailOrder.paket.harga * this.detailOrder.berat,
          },
          item_details: {
            id: this.detailOrder.id,
            price: this.detailOrder.paket.harga,
            quantity: this.detailOrder.berat,
            name: this.detailOrder.paket.nama,
            merchant_name: "Alief Laundry",
          },
          customer_details: {
            first_name: this.username[0].first_name,
            last_name: this.username[0].last_name,
            phone: this.username[0].phone,
          },
          enabled_payments: [
            "credit_card",
            "cimb_clicks",
            "bca_klikbca",
            "bca_klikpay",
            "bri_epay",
            "echannel",
            "permata_va",
            "bca_va",
            "bni_va",
            "bri_va",
            "other_va",
            "gopay",
            "indomaret",
            "danamon_online",
            "akulaku",
            "shopeepay",
            "kredivo",
            "uob_ezpay",
          ],
          gopay: {
            enable_callback: true,
            callback_url: "http://gopay.com",
          },
        }),
      });
      return res.json();
    },
    async payOrder() {
      const router = useRouter();
      const getPropsId = this.$props.id;
      const data = await this.payPesanan();
      let tokenTransaction = data.token;
      snap.pay(tokenTransaction, {
        onSuccess: async function (result) {
          console.log(result);
          await supabase
            .from("pesanan")
            .update({ status: "Lunas" })
            .eq("id", getPropsId);
          alert(result.status_message);
          router.push({ name: "Pesanan" });
        },
        onPending: function (result) {
          alert(result.status_message);
        },
        onError: function (result) {
          router.push({ name: "Pesanan" });
          console.log(result);
        },
        onClose: function () {
          alert("customer closed the popup without finishing the payment");
        },
        gopayMode: "qr",
      });
      await this.addToPembayaran();
    },
  },
  async created() {
    const data = await this.fetchOrder();
    this.detailOrder = data;

    const userInfo = await this.loggedInUser();
    this.username = userInfo;
  },
};
</script>
