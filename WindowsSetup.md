### I dont have menatal capacity to write windows scripts so:

1. Install Docker Desktop

2. Install minikube

3. Install kubectl

4. Install Tilt

5. run `docker context use default`

6. run `minikube start`

7. run `minikube addons enable ingress`

8. Add this lines to `C:\Windows\System32\drivers\etc\hosts`
```
    127.0.0.1 auth.hms.test
    127.0.0.1 hms.test
```

9. Run `tilt up`

10. Run `minikube tunnel`

11. Hope that will work


### App Urls:
1. hms.test
2. auth.hms.test