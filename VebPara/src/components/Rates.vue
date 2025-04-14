<script>
import Header from "@/components/Header.vue";
import { defineComponent } from "vue";
import Footer from "@/components/Footer.vue";
import CustomReviews from "@/components/CustomReviews.vue";

export default defineComponent({
  components: { Header, Footer, CustomReviews },
});
</script>

<template>
  <Header />
  <CustomReviews />
  <Footer />
</template>