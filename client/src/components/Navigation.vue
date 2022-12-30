<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <Popover class="relative bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6">
      <div
        class="flex items-center justify-between border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10"
      >
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <router-link to="/">
            <span class="sr-only">Your Company</span>
            <img
              class="h-8 w-auto sm:h-10"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt=""
            />
          </router-link>
        </div>
        <div class="-my-2 -mr-2 md:hidden">
          <PopoverButton
            class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span class="sr-only">Open menu</span>
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
          </PopoverButton>
        </div>
        <PopoverGroup as="nav" class="hidden space-x-10 md:flex">
          <router-link
            :to="{ name: 'Paket' }"
            class="text-base font-medium text-gray-500 hover:text-gray-900"
            >Paket</router-link
          >
          <router-link
            v-if="user"
            :to="{ name: 'Pesanan' }"
            class="text-base font-medium text-gray-500 hover:text-gray-900"
            >Pesanan</router-link
          >
        </PopoverGroup>
        <div class="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
          <div v-if="!user">
            <router-link
              :to="{ name: 'Login' }"
              class="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
              >Login</router-link
            >
            <router-link
              :to="{ name: 'Register' }"
              class="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
              >Register</router-link
            >
          </div>
          <div v-if="user">
            <li
              class="ml-8 inline-flex cursor-default items-center justify-center whitespace-nowrap text-base font-medium text-black"
            >
              {{ user.email }}
            </li>
            <li
              @click="logout"
              class="ml-8 cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Logout
            </li>
          </div>
        </div>
      </div>
    </div>

    <transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <PopoverPanel
        focus
        class="absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden"
      >
        <div
          class="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div class="px-5 pt-5 pb-6">
            <div class="flex items-center justify-between">
              <div>
                <img
                  class="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt="Your Company"
                />
              </div>
              <div class="-mr-2">
                <PopoverButton
                  class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  <span class="sr-only">Close menu</span>
                  <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                </PopoverButton>
              </div>
            </div>
          </div>
          <div class="space-y-6 py-6 px-5">
            <div class="grid grid-cols-2 gap-y-4 gap-x-8">
              <router-link
                :to="{ name: 'Paket' }"
                class="text-base font-medium text-gray-900 hover:text-gray-700"
                >Paket</router-link
              >

              <router-link
                :to="{ name: 'Pesanan' }"
                class="text-base font-medium text-gray-900 hover:text-gray-700"
                >Pesanan</router-link
              >
            </div>
            <div>
              <router-link
                :to="{ name: 'Register' }"
                class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                >Sign up</router-link
              >
              <p class="mt-6 text-center text-base font-medium text-gray-500">
                Existing customer?
                {{ " " }}
                <router-link
                  :to="{ name: 'Login' }"
                  class="text-indigo-600 hover:text-indigo-500"
                  >Sign in</router-link
                >
              </p>
            </div>
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script>
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/vue";
import {
  ArrowPathIcon,
  Bars3Icon,
  PhoneIcon,
  PlayIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

import supabase from "../supabase/supabase";
import { useRouter } from "vue-router";
import { onUpdated } from "@vue/runtime-core";

export default {
  props: ["user"],
  components: {
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
    ArrowPathIcon,
    Bars3Icon,
    PhoneIcon,
    PlayIcon,
    ShieldCheckIcon,
    Squares2X2Icon,
    XMarkIcon,
    ChevronDownIcon,
  },
  data() {
    return {
      username: null,
    };
  },
  methods: {
    async loggedInUser() {
      const res = await supabase.from("profiles").select("*");
      return res.data;
    },
  },
  async created() {
    const data = await this.loggedInUser();
    this.username = data;
  },
  setup() {
    const router = useRouter();

    const logout = async () => {
      const { error } = await supabase.auth.signOut();
      router.push({ name: "Home" });
    };

    return { logout };
  },
};
</script>
