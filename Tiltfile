kustomize = kustomize('./deployment/overlays/dev/')
k8s_yaml(kustomize)


docker_build('client','client/',
    dockerfile='client/Dockerfile.dev',
    live_update=[
        sync('./client', '/app'),
        run('cd /app && npm install', trigger='./client/package.json')
    ]
)
docker_build('validator','validator/',
    live_update=[
        sync('./validator/', '/app')
    ]
)
docker_build('patients','patients/',
    live_update=[
        sync('./patients/', '/app')
    ]
)
docker_build('resources','resources/',
    live_update=[
        sync('./resources/', '/app')
    ]
)
docker_build('documents','documents/',
    live_update=[
        sync('./documents/', '/app')
    ]
)

docker_build('kraken','kraken/')

k8s_resource('client')
k8s_resource('validator')
k8s_resource('patients')
k8s_resource('resources')
k8s_resource('kraken')  
k8s_resource('postgres')
k8s_resource('patients-db')
k8s_resource('resources-db')
k8s_resource('documents-db')
k8s_resource('documents')