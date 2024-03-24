k8s_yaml('deployment/client.yaml')
k8s_yaml('deployment/keycloak.yaml')
k8s_yaml('deployment/validator.yaml')

docker_build('client','client/')
docker_build('validator','validator/',live_update=[
    sync('./validator/', '/app')
])


k8s_resource('client')