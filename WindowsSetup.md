### I dont have menatal capacity to write windows scripts so:

1. Install Docker Desktop

2. Install minikube

3. Install kubectl

4. Install Tilt

5. run `docker context use default`

6. run `minikube start`

7. run `minikube addons enable ingress`

8. run `minikube ip` ***this ip could change everytime you recreate minikube***

9. Add this lines to `C:\Windows\System32\drivers\etc\hosts`
```
    <minikube ip> auth.app.test
    <minikube ip> app.test
    127.0.0.1 auth.app.test
    127.0.0.1 app.test
```

10. Run `tilt up`

11. Run `minikube tunnel`

12. Hope that will work


### App Urls:
1. app.test
2. auth.app.test

