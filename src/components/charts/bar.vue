<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from "echarts";
import tdTheme from "./theme.json";
import { on, off } from "@/libs/tools";
echarts.registerTheme("tdTheme", tdTheme);
export default {
  name: "ChartBar",
  props: {
    value: Object,
    text: String,
    subtext: String,
  },
  data() {
    return {
      dom: null,
    };
  },
  watch: {
    value: {
      handler(newvalue,oldvalue) {
        this.drawChart();
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.drawChart()
    })
  },
  methods: {
    resize() {
      this.dom.resize();
    },
    drawChart() {
      let xAxisData = Object.keys(this.value);
      let seriesData = Object.values(this.value);
      let option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: "center",
        },
        xAxis: {
          type: "category",
          data: xAxisData,
        },
        yAxis: {
          minInterval:1,
          type: "value",
        },
        series: [
          {
            data: seriesData,
            type: "bar",
          },
        ],
      };
      this.dom = echarts.init(this.$refs.dom, "tdTheme");
      this.dom.setOption(option);
      on(window, "resize", this.resize);
    },
  },
  beforeDestroy() {
    off(window, "resize", this.resize);
  },
};
</script>
