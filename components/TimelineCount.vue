<template>
  <div ref="container" align="center">
    <b-table :data="filteredData" :columns="columns"></b-table>
  </div>
</template>

<script>
export default {
  props: {
    developers: { type: Array },
    startDate: { type: Date },
    endDate: { type: Date },
  },

  data() {
    return {
      data: [],
      columns: [
        {
          field: "developer",
          label: "Developer",
          sortable: true,
        },
        {
          field: "author",
          label: "Author",
          sortable: true,
        },
        {
          field: "review",
          label: "Review",
          sortable: true,
        },
      ]
    }
  },

  watch: {
    developers: "developersChanged",
  },

  computed: {
    filteredData() {
      const filterDate = d => {
        const date = new Date(d);
        return date >= this.startDate && //
               date <= this.endDate;
      }
      return this.data.map(d => {
        return {
          developer: d.developer,
          author: d.author.filter(filterDate).length,
          review: d.review.filter(filterDate).length,
        };
      });
    },
  },

  methods: {
    async developersChanged() {
      const data = await this.$chromeDataAll(this.developers);
      this.data = data.map(d => {
        return {
          developer: d.developer,
          author: Object.keys(d.data.author),
          review: Object.keys(d.data.review),
        };
      });
    },
  }
};
</script>
