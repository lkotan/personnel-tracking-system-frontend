<template>
  <div class="container">
    <div class="chart d-flex justify-content-center">
      <client-only>
        <VueApexCharts
          width="500"
          height="350"
          type="pie"
          :options="cData"
          :series="series"
        ></VueApexCharts>
      </client-only>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: 'auth-user',
  components: {
     VueApexCharts: () => import('vue-apexcharts')
  },
  computed: {
    ...mapGetters({
      chart: 'personnels/getDashChart'
    }),
    cData() {
      this.series = []
      this.chartOptions.labels = []
      this.chart.forEach(item => {
        this.chartOptions.labels.push(item.personnelFullName)
        this.series.push(item.assigmentCount)
      })
      return this.chartOptions
    }
  },
  data() {
    return {
      series: [],
      chartOptions: {
        chart: {
          width: 380,
          type: 'pie'
        },
        labels: [],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        ]
      }
    }
  },
  created() {
    this.getChart()
  }
}
</script>

<style></style>
