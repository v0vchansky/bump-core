pull:
	docker pull v0vchansky/bump-core

run:
	docker run \
	--name api \
	-p 80:8080 \
	--restart on-failure \
	-d \
	--env-file ./.env \
	v0vchansky/bump-core:latest

stop:
	docker stop api && docker rm api

reload:
	make pull \
	&& make stop \
	&& make run

start:
	make pull \
	&& make run

attach:
	docker container attach

ps:
	docker ps -a
