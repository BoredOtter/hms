k8s_yaml('deployment/client.yaml')
k8s_yaml('deployment/keycloak.yaml')
k8s_yaml('deployment/validator.yaml')
k8s_yaml('deployment/secrets.yaml')
k8s_yaml('deployment/kraken.yaml')


docker_build('client','client/')
docker_build('validator','validator/',live_update=[
    sync('./validator/', '/app')
])
docker_build('kraken','kraken/')

k8s_resource('client')
k8s_resource('validator')
k8s_resource('kraken')  