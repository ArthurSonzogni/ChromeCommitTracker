<template>
  <div>
    <Navbar/>
    <section class="section">
      <div class="container">
        <h1 class="title">Organizations contributions</h1>

        <p>
          <strong>Repositories?</strong>
        </p>
        <RepositorySelector
          v-model="repositories"
          size="small"
          :allowMultiple="true"
          :allowAll="true"
          />

        <p>
          <strong>Organizations:</strong>
        </p>
        <OrganizationsSelector
          v-model="organizations"
          size="small"
          :allowMultiple="true"
          :allowAll="true"
          :repositories="repositories"
          >
          <div>
            <b-tooltip
              multilined
              label="Include all the organizations that are not in the
            list as 'Others'" position="is-bottom">
              <b-checkbox
                size="small"
                name="others"
                v-model="others"
                >
                Others
              </b-checkbox>
            </b-tooltip>
          </div>
        </OrganizationsSelector>

        <b-field grouped group-multiline>
          <b-field label="As:">
            <b-radio-button name="kind" v-model="kind" native-value="author">
              author
            </b-radio-button>
            <b-radio-button name="kind" v-model="kind" native-value="review">
              reviewer
            </b-radio-button>
            <b-radio-button name="kind" v-model="kind" native-value="both">
              both
            </b-radio-button>
          </b-field>

          <b-field label="Grouping:">
            <b-radio-button
              name="grouping"
              v-model="grouping"
              native-value="forever">
              Forever
            </b-radio-button>
            <b-radio-button
              name="grouping"
              v-model="grouping"
              native-value="decennial">
              Decennial
            </b-radio-button>
            <b-radio-button
              name="grouping"
              v-model="grouping"
              native-value="yearly">
              Yearly
            </b-radio-button>
            <b-radio-button
              name="grouping"
              v-model="grouping"
              native-value="quarterly">
              Quarterly
            </b-radio-button>
            <b-radio-button
              name="grouping"
              v-model="grouping"
              native-value="monthly">
              Monthly
            </b-radio-button>
          </b-field>

          <b-field label="Colors:">
            <b-radio-button
              name="colors"
              v-model="colors"
              native-value="repositories">
              Repositories
            </b-radio-button>
            <b-radio-button
              name="colors"
              v-model="colors"
              native-value="organizations">
              Organizations
            </b-radio-button>
          </b-field>

          <b-field label="Chart:">
            <b-radio-button
              name="chart"
              v-model="chart"
              native-value="line">
              Line
            </b-radio-button>
            <b-radio-button
              name="chart"
              v-model="chart"
              native-value="bar">
              Bar
            </b-radio-button>
          </b-field>

        </b-field>

        <Organizations
          :repositories="repositories"
          :grouping="grouping"
          :colors="colors"
          :kind="kind"
          :organizations="organizations"
          :chart="chart"
          :dates="dates"
          :others="others"
          :percent="percent === 'percent'"
          >
          <b-radio-button
            size="small"
            name="percent"
            v-model="percent"
            native-value="absolute"
            >
            Absolute
          </b-radio-button>
          <b-radio-button
            size="small"
            name="percent"
            v-model="percent"
            native-value="percent"
            >
            Percent
          </b-radio-button>

        </Organizations>

      </div>
    </section>

    <section class="section">
      <b-field expanded>
        <Timeline v-model="dates" ></Timeline>
      </b-field>
    </section>
  </div>
</template>

<script>

import all_organizations from 'static/data/organizations.json'

export default {
  data() {
    let repositories = ["chromium"];
    if(this.$route.query.repositories) {
      repositories = this.$route.query.repositories.split(",");
    }

    let organizations = ["Google"];
    if (this.$route.query.organizations) {
      if (this.$route.query.organizations === "all") {
        organizations = all_organizations;
      } else {
        organizations = this.$route.query.organizations.split(",");
      }
    }

    let grouping = "yearly";
    if (this.$route.query.grouping) {
      grouping = this.$route.query.grouping;
    }

    let kind = "author";
    if (this.$route.query.kind) {
      kind = this.$route.query.kind;
    }

    let colors = "repositories";
    if (this.$route.query.colors) {
      colors = this.$route.query.colors;
    }

    let chart = "bar";
    if (this.$route.query.chart) {
      chart = this.$route.query.chart;
    }

    let dates = [new Date("2000-01-01"), new Date()];
    if (this.$route.query.dates) {
      dates = this.$route.query.dates.split(',').map(d => new Date(d));
    }

    let others = this.$route.query.others === null;

    let percent = this.$route.query.percent === null ? 'percent' : 'absolute';

    return {
      chart,
      colors,
      dates,
      grouping,
      kind,
      organizations,
      others,
      percent,
      repositories,
    }
  },

  methods: {
    updateUrl() {
      this.$router.push({
        query: {
          repositories: this.repositories.join(","),
          organizations: this.organizations.length === all_organizations.length
            ? "all"
            : this.organizations.join(","),
          grouping: this.grouping,
          colors: this.colors,
          kind: this.kind,
          chart: this.chart,
          dates: this.dates.map(d => d.toISOString().split("T")[0]).join(','),
          others: this.others ? null : undefined,
          percent: this.percent === "percent" ? null : undefined,
        },
      });
    },
  },

  watch: {
    repositories: "updateUrl",
    organizations: "updateUrl",
    grouping: "updateUrl",
    colors: "updateUrl",
    kind: "updateUrl",
    chart: "updateUrl",
    dates: "updateUrl",
    others: "updateUrl",
    percent: "updateUrl",
  }
}

</script>

