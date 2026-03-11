# WallRank Component Checklist

This checklist maps the MVP routes to shared and page-specific components so implementation can be split cleanly across sprints.

## Global Shell

- `AppShell`
- `TopNav`
- `MobileNavDrawer`
- `Footer`
- `PageSection`
- `EmptyState`
- `LoadingSkeleton`
- `ErrorState`
- `AuthGuard`
- `AdminGuard`

## Shared Data UI

- `SpotCard`
- `SpotResultCard`
- `SpotPreviewCard`
- `ArtistCard`
- `ArtistFeatureCard`
- `LeaderboardTable`
- `LeaderboardRow`
- `SupporterBadge`
- `RatingStars`
- `RatingHistogram`
- `CommentComposer`
- `CommentCard`
- `CommentThread`
- `FilterChips`
- `SearchBar`
- `SortSelect`
- `StatusBadge`
- `ShareActions`
- `ReportButton`
- `ProfileStatRow`
- `SectionHeader`

## Landing Page `/`

- `HeroSection`
- `HeroMapPreview`
- `FeaturedArtistStack`
- `LiveMapPreviewSection`
- `MonthlyTopFiveSection`
- `TopSupportersSection`
- `LatestUploadsGrid`
- `CultureFeaturesSection`
- `NewsletterOrPromoPanel` placeholder

## Map Page `/map`

- `MapPageShell`
- `MapToolbar`
- `CitySelector`
- `UseMyLocationButton`
- `MapFilterDrawer`
- `MapFiltersPanel`
- `MapResultsList`
- `MapView`
- `MapClusterLayer`
- `MapPin`
- `MapPreviewPopover`

## Artist Index `/artists`

- `ArtistsPageHeader`
- `ArtistSearchBar`
- `ArtistFilters`
- `ArtistGrid`
- `ArtistRankingHighlights`

## Artist Detail `/artists/[slug]`

- `ArtistHero`
- `ArtistAvatar`
- `ArtistIdentityBlock`
- `ArtistSocialLinks`
- `ArtistVerifiedBadge`
- `ArtistStatsRow`
- `ArtistTabs`
- `ArtistGalleryTab`
- `ArtistMapTab`
- `ArtistStatsTab`
- `ArtistFeaturesTab`
- `ArtistAboutTab`
- `RatingsOverTimeChart`
- `MonthlyPointsChart`
- `TopPiecesList`

## Spot Detail `/spots/[slug]`

- `SpotHero`
- `SpotImageCarousel`
- `SpotIdentityBlock`
- `SpotSummaryCard`
- `SpotTabs`
- `SpotOverviewTab`
- `SpotGalleryTimelineTab`
- `SpotRatingsTab`
- `SpotCommentsTab`
- `EmbeddedMiniMap`
- `DirectionsButton`
- `TimelineGallery`
- `StickySpotActionBar`
- `UploadWallPhotoButton`

## Leaderboard `/leaderboard`

- `LeaderboardHeader`
- `LeaderboardTypeTabs`
- `LeaderboardRangeTabs`
- `ArtistLeaderboardTable`
- `SupporterLeaderboardTable`
- `RewardWidget`
- `RulesSummaryCard`
- `FeatureAnnouncementCard`

## Upload Flow `/upload`

- `UploadWizard`
- `UploadStepIndicator`
- `UploadPhotoStep`
- `UploadDropzone`
- `UploadPreviewGrid`
- `PlaceLocationStep`
- `LocationPinPicker`
- `AddressSearchInput`
- `VisibilityToggle`
- `IdentifyWorkStep`
- `ArtistLookupField`
- `CategorySelect`
- `WallStatusSelect`
- `DetailsStep`
- `TagInput`
- `ModerationNotice`
- `AgreementCheckbox`
- `SubmitStep`

## User Profile `/profile`

- `UserProfileHeader`
- `UserAvatarCard`
- `UserSocialLinks`
- `SupporterLevelBadge`
- `UserStatsRow`
- `UserProfileTabs`
- `ActivityFeed`
- `UserUploadsGrid`
- `UserCommentsList`
- `UserBadgesGrid`
- `RewardsPanel`

## Settings `/settings`

- `AccountSettingsForm`
- `ProfileSettingsForm`
- `LinkedSocialAccountsForm`
- `PrivacySettingsForm`
- `DangerZoneCard`

## Admin Dashboard `/admin`

- `AdminOverviewHeader`
- `AdminStatCards`
- `PendingSpotsQueue`
- `PendingImagesQueue`
- `ArtistClaimsQueue`
- `ReportsQueue`
- `FeatureManagerPanel`
- `RecentUserActionsPanel`

## Admin Detail Pages

### `/admin/spots`

- `AdminSpotTable`
- `SpotModerationDrawer`
- `SpotApprovalActions`

### `/admin/artists`

- `AdminArtistTable`
- `ArtistMergeOrTagEditor`
- `ArtistClaimReviewPanel`

### `/admin/reports`

- `AdminReportTable`
- `ReportResolutionPanel`

### `/admin/features`

- `TopFiveManager`
- `FeaturePublishForm`
- `FeaturedArtistSelector`

### `/admin/users`

- `AdminUserTable`
- `UserRoleEditor`
- `BanUserAction`

## Sprint Suggestion

### Sprint 1

- `AppShell`
- `TopNav`
- `Footer`
- `HeroSection`
- `LiveMapPreviewSection`
- `MonthlyTopFiveSection`
- `LatestUploadsGrid`

### Sprint 2

- `MapPageShell`
- `MapToolbar`
- `MapView`
- `SpotResultCard`
- `SpotHero`
- `SpotSummaryCard`
- `ArtistHero`
- `ArtistStatsRow`

### Sprint 3

- `UploadWizard`
- `UploadDropzone`
- `LocationPinPicker`
- `AdminStatCards`
- `PendingSpotsQueue`

### Sprint 4

- `RatingStars`
- `RatingHistogram`
- `CommentComposer`
- `CommentThread`
- `LeaderboardHeader`
- `ArtistLeaderboardTable`
- `SupporterLeaderboardTable`
