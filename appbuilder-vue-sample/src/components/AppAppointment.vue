<template>
  <div id="app">
    <AppHeader />
    <main class="main-content">
      <section class="hero">
        <div class="content">
          <h1>Book Doctor Appointments Seamlessly</h1>
          <p>
            Instantly create secure video meetings between doctors and patients.
          </p>
          <div class="action-row">
            <!-- Meeting Name -->
            <input
              type="text"
              v-model="meetingName"
              placeholder="Enter Meeting Name"
              class="meeting-input"
            />

            <!-- Button -->
            <button
              @click="createAppointment"
              :disabled="!meetingName.trim() || loading"
              :class="{ disabled: !meetingName.trim() || loading }"
            >
              {{ loading ? "Creating..." : "Create Doctor Appointment" }}
            </button>
          </div>

          <!-- Spinner -->
          <div v-if="loading" class="spinner-wrapper">
            <div class="spinner"></div>
            <p class="spinner-text">Creating meeting...</p>
          </div>

          <!-- Cards -->
          <div v-if="!loading && meetingLinks" class="link-boxes">
            <div class="card">
              <h3>Doctor’s Meeting Room</h3>
              <button @click="openModal('doctor')">Join as Doctor</button>
            </div>
            <div class="card">
              <h3>Patient’s Join Room</h3>
              <button @click="openModal('patient')">Join as Patient</button>
            </div>
          </div>

          <!-- Modal -->
          <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal">
              <h3>Join as {{ role === "doctor" ? "Doctor" : "Patient" }}</h3>
              <p class="modal-subtitle">
                Joining Meeting: <strong>{{ meetingName }}</strong>
              </p>

              <input
                type="text"
                placeholder="Enter your name"
                v-model="userName"
              />
              <div class="modal-buttons">
                <button
                  @click="generateToken"
                  :disabled="!userName.trim() || tokenLoading"
                >
                  {{ tokenLoading ? "Generating..." : "Generate Token" }}
                </button>

                <button @click="joinMeeting" :disabled="!token">
                  Join Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "./AppHeader.vue";
import AppFooter from "./AppFooter.vue";

export default {
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      loading: false,
      meetingLinks: null,
      showModal: false,
      role: "",
      userName: "",
      meetingName: "",
      token: "",
      tokenLoading: false,
    };
  },
  methods: {
    async generateToken() {
      if (!this.userName.trim()) return;
      this.tokenLoading = true;
      this.token = "";

      try {
        const response = await fetch(
          "https://managedservices-prod.rteappbuilder.com/v1/token/generate",
          {
            method: "POST",
            headers: {
              "X-API-KEY": "ACo1d62f54a66594a84877f3bbbde66efe1",
              "X-Project-ID": "6caf3accbf1bb728874d",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: this.userName }),
          }
        );

        const data = await response.json();
        this.token = data.token;
      } catch (error) {
        alert("Token generation failed");
        console.error(error);
      } finally {
        this.tokenLoading = false;
      }
    },
    async createAppointment() {
      this.loading = true;
      this.meetingLinks = null;

      try {
        const response = await fetch(
          "https://managedservices-prod.rteappbuilder.com/v1/channel",
          {
            method: "POST",
            headers: {
              "X-API-KEY": "ACo1d62f54a66594a84877f3bbbde66efe1",
              "X-Project-ID": "6caf3accbf1bb728874d",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: this.meetingName,
            }),
          }
        );

        const data = await response.json();

        //data.tite
        this.meetingLinks = {
          doctor: data.host_pass_phrase,
          patient: data.viewer_pass_phrase,
        };
      } catch (error) {
        alert("Failed to create meeting. Please check API credentials.");
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    openModal(role) {
      this.role = role;
      this.userName = "";
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    joinMeeting() {
      const link =
        this.role === "doctor"
          ? this.meetingLinks.doctor
          : this.meetingLinks.patient;
      this.meetingId = link;

      // this.$router.push({
      //   name: "Meeting",
      //   query: {
      //     meetingId: link,
      //     token: this.token,
      //     name: this.userName,
      //   },
      // });
      const url =
        `${window.location.origin}/meeting?` +
        new URLSearchParams({
          meetingId: link,
          token: this.token,
          name: this.userName,
        }).toString();

      window.open(url, "_blank");

      this.closeModal();
    },
  },
};
</script>

<style scoped>
.hero {
  padding: 4rem 1rem;
  text-align: center;
  flex: 1;
}

.content h1 {
  font-size: 2.2rem;
  color: #2a9d8f;
  margin-bottom: 0.5rem;
}

.content p {
  color: #555;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.meeting-input {
  padding: 0.5rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 100%;
  max-width: 400px;
}

.content button {
  background-color: #2a9d8f;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.content button:hover {
  background-color: #21867a;
}

.spinner-wrapper {
  margin-top: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2a9d8f;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

.spinner-text {
  font-size: 1rem;
  color: #2a9d8f;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.link-boxes {
  margin-top: 2.5rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 220px;
}

.card h3 {
  margin-bottom: 1rem;
}

.card button {
  background: #0077cc;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.card button:hover {
  background: #005fa3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  background: #fff;
  padding: 2rem;
  width: 300px;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.modal h3 {
  margin-bottom: 1rem;
  color: #2a9d8f;
}

.modal input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.modal button {
  background-color: #2a9d8f;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.modal button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.modal-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}
.action-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.meeting-input {
  padding: 0.6rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 100%;
  max-width: 300px;
}

button.disabled {
  background-color: #b3dcd7 !important;
  cursor: not-allowed;
  opacity: 0.6;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to right, #e0f7fa, #ffffff);
}
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
