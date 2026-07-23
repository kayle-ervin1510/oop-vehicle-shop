-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.Users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name character varying NOT NULL,
  preferred_name character varying NOT NULL,
  username character varying NOT NULL UNIQUE,
  email character varying NOT NULL UNIQUE,
  password character varying NOT NULL DEFAULT ''::character varying,
  CONSTRAINT Users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Parent_Profile (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  preferred_name character varying NOT NULL,
  activity_log bigint NOT NULL DEFAULT 0,
  user_id uuid NOT NULL,
  child_id uuid NOT NULL UNIQUE,
  screen_time integer NOT NULL DEFAULT 0,
  child_screen_time integer NOT NULL DEFAULT 0,
  Delete_Account timestamp with time zone,
  CONSTRAINT Parent_Profile_pkey PRIMARY KEY (id),
  CONSTRAINT parent_profile_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.Users(id)
);
CREATE TABLE public.Connected_Devices (
  Device_id uuid NOT NULL DEFAULT gen_random_uuid(),
  Device_name character varying NOT NULL UNIQUE,
  Remove_Device timestamp with time zone,
  Add_Device timestamp with time zone,
  CONSTRAINT Connected_Devices_pkey PRIMARY KEY (Device_id)
);
CREATE TABLE public.Children_Profile (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  child_name character varying NOT NULL,
  child_id uuid NOT NULL,
  Device_id uuid,
  Time_Restricted time without time zone,
  Time_Unlimited time without time zone,
  Unauthorized time without time zone,
  screen_time_goal boolean NOT NULL DEFAULT false,
  child_screen_time integer NOT NULL DEFAULT 0,
  Remove_child timestamp with time zone,
  CONSTRAINT Children_Profile_pkey PRIMARY KEY (id),
  CONSTRAINT children_profile_child_id_foreign FOREIGN KEY (child_id) REFERENCES public.Parent_Profile(child_id),
  CONSTRAINT children_profile_device_id_foreign FOREIGN KEY (Device_id) REFERENCES public.Connected_Devices(Device_id)
);
CREATE TABLE public.App_Restrictions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL,
  app_name character varying NOT NULL,
  is_allowed boolean NOT NULL DEFAULT true,
  daily_limit_minutes integer,
  CONSTRAINT App_Restrictions_pkey PRIMARY KEY (id),
  CONSTRAINT app_restrictions_child_id_foreign FOREIGN KEY (child_id) REFERENCES public.Children_Profile(id)
);
CREATE TABLE public.Time_Unlimited_Apps (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL,
  app_name character varying NOT NULL,
  CONSTRAINT Time_Unlimited_Apps_pkey PRIMARY KEY (id),
  CONSTRAINT time_unlimited_apps_child_id_foreign FOREIGN KEY (child_id) REFERENCES public.Children_Profile(id)
);
CREATE TABLE public.Unauthorized_Apps (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL,
  app_name character varying NOT NULL,
  CONSTRAINT Unauthorized_Apps_pkey PRIMARY KEY (id),
  CONSTRAINT unauthorized_apps_child_id_foreign FOREIGN KEY (child_id) REFERENCES public.Children_Profile(id)
);
CREATE TABLE public.Time_Restricted_Apps (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL,
  app_name character varying NOT NULL,
  Edit_Time integer NOT NULL DEFAULT 0,
  CONSTRAINT Time_Restricted_Apps_pkey PRIMARY KEY (id),
  CONSTRAINT time_restricted_apps_child_id_foreign FOREIGN KEY (child_id) REFERENCES public.Children_Profile(id)
);
