kustomize = kustomize('./deployment/overlays/dev')
k8s_yaml(kustomize)


docker_build('client','client-old/',
    live_update=[
        sync('./client-old', '/app'),
        run('cd /app && npm install', trigger='./client/package.json')
    ]
)

docker_build('validator','validator/',
    live_update=[
        sync('./validator/', '/app')
    ]
)

docker_build('kraken','kraken/')

k8s_resource('client', port_forwards=8080)
k8s_resource('validator')
k8s_resource('kraken', port_forwards=9000)  
k8s_resource('keycloak', port_forwards='8081:8080')  