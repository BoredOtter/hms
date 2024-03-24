k8s_yaml('deployment/client.yaml')
k8s_yaml('deployment/keycloak.yaml')
k8s_yaml('deployment/kraken.yaml')

docker_build('client','client/')

k8s_resource('client')