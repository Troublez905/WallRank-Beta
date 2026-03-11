insert into public.users (
  id,
  email,
  username,
  display_name,
  city,
  country,
  role,
  supporter_points
) values
  ('11111111-1111-1111-1111-111111111111', 'admin@wallrank.local', 'wallrank_admin', 'WallRank Admin', 'Hamilton', 'Canada', 'admin', 0),
  ('22222222-2222-2222-2222-222222222222', 'maya@wallrank.local', 'mayaspray', 'Maya Spray', 'Hamilton', 'Canada', 'user', 14),
  ('33333333-3333-3333-3333-333333333333', 'joel@wallrank.local', 'joelnorth', 'Joel North', 'Toronto', 'Canada', 'user', 9);

insert into public.artists (
  id,
  owner_user_id,
  tag_name,
  display_name,
  slug,
  city,
  country,
  is_verified,
  is_claimed,
  total_points,
  monthly_points,
  all_time_avg_rating,
  artwork_count,
  spot_count
) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'AERO', 'Aero', 'aero', 'Hamilton', 'Canada', true, true, 93, 28, 4.62, 3, 3),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', null, 'NOVA', 'Nova', 'nova', 'Toronto', 'Canada', false, false, 58, 19, 4.24, 2, 2),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', null, 'BRICK', 'Brick', 'brick', 'Niagara', 'Canada', false, false, 41, 12, 4.11, 1, 1);

insert into public.locations (
  id,
  name,
  address_text,
  city,
  province_state,
  country,
  latitude,
  longitude,
  geohash,
  location_visibility,
  is_sensitive
) values
  ('44444444-4444-4444-4444-444444444444', 'King William Wall', 'King William St', 'Hamilton', 'ON', 'Canada', 43.255203, -79.868202, 'dpz89n', 'public_approximate', false),
  ('55555555-5555-5555-5555-555555555555', 'Laneway Junction', 'Dupont St', 'Toronto', 'ON', 'Canada', 43.669021, -79.442851, 'dpz83h', 'public_exact', false),
  ('66666666-6666-6666-6666-666666666666', 'Canal Wall', 'Welland Canal Pkwy', 'Niagara', 'ON', 'Canada', 43.012321, -79.248321, 'dpv1cw', 'public_approximate', false);

insert into public.artworks (
  id,
  artist_id,
  location_id,
  submitted_by_user_id,
  title,
  slug,
  description,
  category,
  style_tags,
  status,
  wall_type,
  date_seen,
  avg_rating,
  ratings_count,
  comments_count,
  artist_points_total,
  is_featured,
  featured_month
) values
  ('77777777-7777-7777-7777-777777777777', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'King William Burner', 'king-william-burner', 'Large multicolor burner with chrome fill and sharp highlights.', 'piece', '{"wildstyle","colorfade"}', 'active', 'warehouse', '2026-03-01', 4.60, 18, 4, 83, true, '2026-03-01'),
  ('88888888-8888-8888-8888-888888888888', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'Junction Mural', 'junction-mural', 'Character mural with layered background textures.', 'mural', '{"character","portrait"}', 'active', 'brick', '2026-02-25', 4.20, 10, 2, 42, false, null),
  ('99999999-9999-9999-9999-999999999999', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'Canal Throwup', 'canal-throwup', 'Quick silver-and-black throwup on a concrete retaining wall.', 'throwup', '{"silver","outline"}', 'active', 'concrete', '2026-02-19', 4.00, 7, 1, 28, false, null);

insert into public.artwork_images (
  id,
  artwork_id,
  uploaded_by_user_id,
  image_url,
  thumbnail_url,
  caption,
  sort_order,
  is_primary,
  timeline_type,
  moderation_status
) values
  ('12121212-1212-1212-1212-121212121212', '77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 'https://example.com/king-william-burner.jpg', 'https://example.com/king-william-burner-thumb.jpg', 'Front view at golden hour.', 0, true, 'standard', 'approved'),
  ('13131313-1313-1313-1313-131313131313', '88888888-8888-8888-8888-888888888888', '33333333-3333-3333-3333-333333333333', 'https://example.com/junction-mural.jpg', 'https://example.com/junction-mural-thumb.jpg', 'Full wall view.', 0, true, 'standard', 'approved');

insert into public.ratings (
  id,
  artwork_id,
  artist_id,
  user_id,
  stars,
  artist_points_awarded,
  supporter_points_awarded,
  is_verified_vote
) values
  ('14141414-1414-1414-1414-141414141414', '77777777-7777-7777-7777-777777777777', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 5, 5, 1, true),
  ('15151515-1515-1515-1515-151515151515', '88888888-8888-8888-8888-888888888888', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 4, 4, 1, false);

insert into public.comments (
  id,
  artwork_id,
  user_id,
  parent_comment_id,
  body,
  helpful_count,
  moderation_status
) values
  ('16161616-1616-1616-1616-161616161616', '77777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', null, 'Fresh color work on this one.', 2, 'visible'),
  ('17171717-1717-1717-1717-171717171717', '77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', '16161616-1616-1616-1616-161616161616', 'Caught it right after the update.', 1, 'visible');

insert into public.artist_point_events (
  id,
  artist_id,
  artwork_id,
  source_type,
  source_id,
  points
) values
  ('18181818-1818-1818-1818-181818181818', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '77777777-7777-7777-7777-777777777777', 'rating', '14141414-1414-1414-1414-141414141414', 5),
  ('19191919-1919-1919-1919-191919191919', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '88888888-8888-8888-8888-888888888888', 'rating', '15151515-1515-1515-1515-151515151515', 4);

insert into public.supporter_point_events (
  id,
  user_id,
  source_type,
  source_id,
  points
) values
  ('20202020-2020-2020-2020-202020202020', '33333333-3333-3333-3333-333333333333', 'rating', '14141414-1414-1414-1414-141414141414', 1),
  ('21212121-2121-2121-2121-212121212121', '33333333-3333-3333-3333-333333333333', 'comment', '16161616-1616-1616-1616-161616161616', 1);

insert into public.monthly_leaderboards (
  id,
  leaderboard_month,
  leaderboard_type,
  entity_id,
  rank_position,
  points_total,
  metadata
) values
  ('23232323-2323-2323-2323-232323232323', '2026-03-01', 'artist', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 28, '{"city":"Hamilton"}'),
  ('24242424-2424-2424-2424-242424242424', '2026-03-01', 'artist', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, 19, '{"city":"Toronto"}'),
  ('25252525-2525-2525-2525-252525252525', '2026-03-01', 'artist', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 3, 12, '{"city":"Niagara"}');

insert into public.featured_artists (
  id,
  artist_id,
  feature_type,
  feature_month,
  headline,
  article_excerpt,
  is_published
) values
  ('26262626-2626-2626-2626-262626262626', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'homepage_top5', '2026-03-01', 'Hamilton color control', 'Aero leads the month with strong community ratings and a standout warehouse burner.', true);
