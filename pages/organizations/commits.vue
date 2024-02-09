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
          />

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
        </b-field>

        <OrganizationContributions
          :repositories="repositories"
          :grouping="grouping"
          :colors="colors"
          :kind="kind"
          :organizations="organizations"
          />
      </div>
    </section>

  </div>
</template>

<script>

export default {
  data() {
    let repositories = ["chromium"];
    if(this.$route.query.repositories) {
      repositories = this.$route.query.repositories.split(",");
    }

    let organizations = ["Google"];
    if (this.$route.query.organizations) {
      organizations = this.$route.query.organizations.split(",");
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

    return {
      repositories,
      grouping,
      colors,
      kind,
      organizations,
    }
  },

  methods: {
    updateUrl() {
      this.$router.push({
        query: {
          repositories: this.repositories.join(","),
          organizations: this.organizations.join(","),
          grouping: this.grouping,
          colors: this.colors,
          kind: this.kind,
        }
      });
    },
  },

  watch: {
    repositories: "updateUrl",
    organizations: "updateUrl",
    grouping: "updateUrl",
    colors: "updateUrl",
    kind: "updateUrl",
  }
}

</script>

</style>
