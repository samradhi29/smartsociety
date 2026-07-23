resource "google_compute_network" "vpc" {
  name                    = "smartsociety-vpc"
  auto_create_subnetworks = true
}