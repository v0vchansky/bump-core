pull:
	docker pull v0vchansky/bump-core

run:
	docker run \
	--name api \
	-p 80:8080 \
	--restart on-failure \
	-d \
	--cpus 3 \
	v0vchansky/bump-core:latest

stop:
	docker stop api && docker rm api

reload:
	make stop \
	&& make run

start:
	make pull \
	&& make run

attash:
	docker container attach

ps:
	docker ps -a
