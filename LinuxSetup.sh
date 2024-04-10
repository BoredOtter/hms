# #/bin/bash
set -e

minikube start

if minikube status | grep -q "host: Running" && minikube status | grep -q "kubelet: Running"; then
    echo "Minikube has successfully started."
else
    echo "Minikube failed to start."
fi

minikube addons enable ingress

#remove old entries
sudo sed -i '/hms\.test\|auth\.hms\.test/d' /etc/hosts

MINIKUBE_IP=$(minikube ip)

#add new entries
echo "$MINIKUBE_IP auth.hms.test hms.test" | sudo tee -a /etc/hosts

echo "Minikube setup complete."

tilt up
