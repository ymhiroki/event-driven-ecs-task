# README

## prerequisites

* docker
* nodejs
* golang

## install a project

```bash
npx install
```

## build a docker image

```bash
cd app/
docker build --tag app .
```

## deploy resources

```bash
npx projen test
```

## test cdk application

```bash
npx projen deploy
```

## References

* [projen](https://github.com/projen/projen)
