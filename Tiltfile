kustomize = kustomize('./deployment/')
k8s_yaml(kustomize)


docker_build('client','client/')

docker_build('validator','validator/',
    live_update=[
        sync('./validator/', '/app')
    ]
)

docker_build('kraken','kraken/')

k8s_resource('client')
k8s_resource('validator')
k8s_resource('kraken')  