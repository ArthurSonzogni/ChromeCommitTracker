<template>
  <div>
    <Navbar/>

    <div>
      <section class="section sticky top">
        <b-field grouped>
          <DevelopersInput v-model="developers" ></DevelopersInput>

          <b-field>
            <b-checkbox-button
              v-model="checkboxStates"
              native-value="author"
              size="is-medium"
              >
              Author
            </b-checkbox-button>

            <b-checkbox-button
              v-model="checkboxStates"
              native-value="review"
              size="is-medium"
              >
              Review
            </b-checkbox-button>
          </b-field>

          <b-field>
            <b-checkbox-button
              v-if="developers.length >= 2"
              v-model="checkboxStates"
              native-value="stacked"
              size="is-medium"
              >
              Stacked
            </b-checkbox-button>

          </b-field>

        </b-field>

      </section>

      <section class="section">
        <div class="container">
          <PeersChart
            :developers="developers"
            :startDate="startDate"
            :endDate="endDate"
            :author="checkboxStates.includes('author')"
            :review="checkboxStates.includes('review')"
            :stacked="checkboxStates.includes('stacked')"
            ></PeersChart>
        </div>
      </section>

      <section class="section sticky bottom">
        <b-field expanded>
          <Timeline @change="changeDate" ></Timeline>
        </b-field>
      </section>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      startDate: new Date(),
      endDate: new Date(),
      developers: [],
      checkboxStates: ["author", "review"],
    };
  },

  async fetch() {
    const response = await fetch("./data/users.json");
    const list = await response.json();
    this.developerList = list;
  },

  methods: {
    changeDate(first, end) {
      this.startDate = first;
      this.endDate = end;
    },
  },
};

const updateHasScrolled = () => {
  const maxScroll = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight, 
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );

  document.documentElement.dataset.scrolltop =
    (window.scrollY > 100) ? 1 : 0;
  document.documentElement.dataset.scrollbottom=
    (maxScroll - window.scrollY > 1000) ? 1 : 0;
};

updateHasScrolled();
document.addEventListener('scroll', updateHasScrolled, { passive: true });

</script>

<style scoped>
.sticky {
  position: sticky;
  width: 100%;
  z-index: 1000;
  backdrop-filter: blur(4px);
  background-color: rgba(255, 255, 255, 0.5);
  transition: background-color 0.2s ease-in-out;
  transition: all 0.1s ease-in-out;
}

html[data-scrolltop= "1"] .sticky.top {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.sticky.top {
  top: 0;
  margin-top:0;
  padding-top:15px;
  margin-bottom:0;
  padding-bottom:15px;
}

.sticky.bottom {
  bottom: 0;
  margin-bottom:0px;
  padding-bottom:15px;
}
</style>
