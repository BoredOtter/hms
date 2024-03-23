k8s_yaml('deployment/spa.yaml')
k8s_yaml('deployment/keycloak.yaml')

docker_build('spa','spa/')

k8s_resource('spa')