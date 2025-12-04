-- Ensure email is unique in profiles to support ON CONFLICT
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_email_key') THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
    END IF;
END $$;

-- Update the trigger function to handle existing profiles (from payment)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, status)
  VALUES (new.id, new.email, 'free')
  ON CONFLICT (email) DO UPDATE
  SET id = new.id; -- Link the auth user to the existing profile
  RETURN new;
END;
$$;
