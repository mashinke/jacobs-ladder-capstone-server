alter table app_user
add constraint email_is_unique unique (email);