app/api/coach/reservations/[id]/approve/route.ts(40,17): error TS2353: Object literal may only specify known properties, and 'approvedBy' does not exist in type '(Without<ReservationUpdateInput, ReservationUncheckedUpdateInput> & ReservationUncheckedUpdateInput) | (Without<...> & ReservationUpdateInput)'.
app/api/gamification/badges/route.ts(25,24): error TS2353: Object literal may only specify known properties, and 'category' does not exist in type 'BadgeOrderByWithRelationInput | BadgeOrderByWithRelationInput[]'.
app/api/gamification/badges/route.ts(42,73): error TS2339: Property 'unlockedAt' does not exist on type '{ badge: { id: string; name: string; createdAt: Date; description: string; imageUrl: string; condition: string | null; }; } & { id: string; userId: string; badgeId: string; awardedAt: Date; }'.
app/api/notifications/[id]/read/route.ts(32,17): error TS2561: Object literal may only specify known properties, but 'readAt' does not exist in type '(Without<NotificationUpdateInput, NotificationUncheckedUpdateInput> & NotificationUncheckedUpdateInput) | (Without<...> & NotificationUpdateInput)'. Did you mean to write 'read'?
app/api/store/checkout/route.ts(64,17): error TS2322: Type 'string' is not assignable to type 'OrderItemUncheckedCreateNestedManyWithoutOrderInput | OrderItemCreateNestedManyWithoutOrderInput | undefined'.
app/api/store/products/route.ts(33,19): error TS2353: Object literal may only specify known properties, and 'featured' does not exist in type 'ProductOrderByWithRelationInput'.
app/api/store/products/route.ts(91,17): error TS2322: Type 'string | null' is not assignable to type 'string | undefined'.
  Type 'null' is not assignable to type 'string | undefined'.
app/api/volunteer/accept-term/route.ts(42,39): error TS2339: Property 'volunteerTermAcceptance' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/api/volunteer/accept-term/route.ts(84,41): error TS2339: Property 'volunteerTermAcceptance' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
app/api/volunteer/accept-term/route.ts(103,17): error TS2353: Object literal may only specify known properties, and 'isVolunteer' does not exist in type '(Without<UserUpdateInput, UserUncheckedUpdateInput> & UserUncheckedUpdateInput) | (Without<...> & UserUpdateInput)'.
app/api/volunteer/availability/route.ts(28,13): error TS2322: Type '{ userId: string; }' is not assignable to type 'VolunteerAvailabilityWhereUniqueInput'.
  Type '{ userId: string; }' is not assignable to type '{ id: string; } & { id?: string | undefined; AND?: VolunteerAvailabilityWhereInput | VolunteerAvailabilityWhereInput[] | undefined; ... 12 more ...; user?: (Without<...> & UserWhereInput) | ... 1 more ... | undefined; }'.
    Property 'id' is missing in type '{ userId: string; }' but required in type '{ id: string; }'.
app/api/volunteer/availability/route.ts(31,17): error TS2353: Object literal may only specify known properties, and 'monday' does not exist in type 'Without<VolunteerAvailabilityCreateInput, VolunteerAvailabilityUncheckedCreateInput> & VolunteerAvailabilityUncheckedCreateInput'.
app/api/volunteer/availability/route.ts(40,17): error TS2353: Object literal may only specify known properties, and 'monday' does not exist in type '(Without<VolunteerAvailabilityUpdateInput, VolunteerAvailabilityUncheckedUpdateInput> & VolunteerAvailabilityUncheckedUpdateInput) | (Without<...> & VolunteerAvailabilityUpdateInput)'.
app/api/volunteer/availability/route.ts(81,13): error TS2322: Type '{ userId: string; }' is not assignable to type 'VolunteerAvailabilityWhereUniqueInput'.
  Type '{ userId: string; }' is not assignable to type '{ id: string; } & { id?: string | undefined; AND?: VolunteerAvailabilityWhereInput | VolunteerAvailabilityWhereInput[] | undefined; ... 12 more ...; user?: (Without<...> & UserWhereInput) | ... 1 more ... | undefined; }'.
    Property 'id' is missing in type '{ userId: string; }' but required in type '{ id: string; }'.
app/api/volunteer/tasks/[id]/accept/route.ts(57,17): error TS2353: Object literal may only specify known properties, and 'acceptedAt' does not exist in type 'Without<VolunteerTaskUpdateInput, VolunteerTaskUncheckedUpdateInput> & VolunteerTaskUncheckedUpdateInput'.
app/api/volunteer/tasks/[id]/review/route.ts(59,52): error TS2339: Property 'estimatedHours' does not exist on type '{ assignedTo: { id: string; name: string; email: string; role: string; password: string; image: string | null; emailVerified: Date | null; createdAt: Date; updatedAt: Date; points: number; level: number; }; } & { ...; }'.
app/api/volunteer/tasks/[id]/review/route.ts(77,17): error TS2353: Object literal may only specify known properties, and 'feedback' does not exist in type 'Without<VolunteerTaskUpdateInput, VolunteerTaskUncheckedUpdateInput> & VolunteerTaskUncheckedUpdateInput'.
app/api/volunteer/tasks/[id]/review/route.ts(78,50): error TS2339: Property 'estimatedHours' does not exist on type '{ assignedTo: { id: string; name: string; email: string; role: string; password: string; image: string | null; emailVerified: Date | null; createdAt: Date; updatedAt: Date; points: number; level: number; }; } & { ...; }'.
app/api/volunteer/tasks/[id]/review/route.ts(112,21): error TS2353: Object literal may only specify known properties, and 'tasksCompleted' does not exist in type 'Without<VolunteerReputationCreateInput, VolunteerReputationUncheckedCreateInput> & VolunteerReputationUncheckedCreateInput'.
app/api/volunteer/tasks/[id]/review/route.ts(113,53): error TS2339: Property 'estimatedHours' does not exist on type '{ assignedTo: { id: string; name: string; email: string; role: string; password: string; image: string | null; emailVerified: Date | null; createdAt: Date; updatedAt: Date; points: number; level: number; }; } & { ...; }'.
app/api/volunteer/tasks/[id]/review/route.ts(118,21): error TS2353: Object literal may only specify known properties, and 'tasksCompleted' does not exist in type '(Without<VolunteerReputationUpdateInput, VolunteerReputationUncheckedUpdateInput> & VolunteerReputationUncheckedUpdateInput) | (Without<...> & VolunteerReputationUpdateInput)'.
app/api/volunteer/tasks/[id]/review/route.ts(119,66): error TS2339: Property 'estimatedHours' does not exist on type '{ assignedTo: { id: string; name: string; email: string; role: string; password: string; image: string | null; emailVerified: Date | null; createdAt: Date; updatedAt: Date; points: number; level: number; }; } & { ...; }'.
app/api/volunteer/tasks/[id]/submit/route.ts(60,17): error TS2353: Object literal may only specify known properties, and 'notes' does not exist in type '(Without<VolunteerTaskUpdateInput, VolunteerTaskUncheckedUpdateInput> & VolunteerTaskUncheckedUpdateInput) | (Without<...> & VolunteerTaskUpdateInput)'.
app/api/volunteer/tasks/route.ts(46,17): error TS2353: Object literal may only specify known properties, and 'category' does not exist in type '(Without<VolunteerTaskCreateInput, VolunteerTaskUncheckedCreateInput> & VolunteerTaskUncheckedCreateInput) | (Without<...> & VolunteerTaskCreateInput)'.
app/api/volunteer/tasks/route.ts(110,19): error TS2353: Object literal may only specify known properties, and 'deadline' does not exist in type 'VolunteerTaskOrderByWithRelationInput'.
app/api/volunteer/tasks/route.ts(113,17): error TS2353: Object literal may only specify known properties, and 'createdBy' does not exist in type 'VolunteerTaskInclude<DefaultArgs>'.
app/profile/personal-data/page.tsx(16,5): error TS2305: Module '"lucide-react"' has no exported member 'IdCard'.
app/settings/page.tsx(16,5): error TS2305: Module '"lucide-react"' has no exported member 'Toggle'.
app/settings/page.tsx(253,48): error TS2339: Property 'danger' does not exist on type '{ id: string; icon: Element; title: string; description: string; type: "toggle"; value: boolean; } | { id: string; icon: Element; title: string; description: string; type: "link"; value?: undefined; } | { ...; } | { ...; } | { ...; }'.
  Property 'danger' does not exist on type '{ id: string; icon: Element; title: string; description: string; type: "toggle"; value: boolean; }'.
app/settings/page.tsx(258,48): error TS2339: Property 'danger' does not exist on type '{ id: string; icon: Element; title: string; description: string; type: "toggle"; value: boolean; } | { id: string; icon: Element; title: string; description: string; type: "link"; value?: undefined; } | { ...; } | { ...; } | { ...; }'.
  Property 'danger' does not exist on type '{ id: string; icon: Element; title: string; description: string; type: "toggle"; value: boolean; }'.
app/settings/page.tsx(263,75): error TS2339: Property 'danger' does not exist on type '{ id: string; icon: Element; title: string; description: string; type: "toggle"; value: boolean; } | { id: string; icon: Element; title: string; description: string; type: "link"; value?: undefined; } | { ...; } | { ...; } | { ...; }'.
  Property 'danger' does not exist on type '{ id: string; icon: Element; title: string; description: string; type: "toggle"; value: boolean; }'.
lib/api/astronomy.ts(3,21): error TS2307: Cannot find module 'suncalc' or its corresponding type declarations.
lib/api/weather.ts(3,19): error TS2307: Cannot find module 'axios' or its corresponding type declarations.
lib/gps/tracker.ts(215,32): error TS2345: Argument of type 'import("C:/Users/victo/Downloads/Sport/lib/gps/tracker").GPSPoint[]' is not assignable to parameter of type 'import("C:/Users/victo/Downloads/Sport/lib/db/indexed-db").GPSPoint[]'.
  Type 'import("C:/Users/victo/Downloads/Sport/lib/gps/tracker").GPSPoint' is not assignable to type 'import("C:/Users/victo/Downloads/Sport/lib/db/indexed-db").GPSPoint'.
    Types of property 'timestamp' are incompatible.
      Type 'string' is not assignable to type 'number'.
lib/jobs/background-jobs.ts(4,24): error TS2307: Cannot find module '@/lib/prisma' or its corresponding type declarations.
lib/jobs/background-jobs.ts(72,51): error TS7006: Parameter 'sum' implicitly has an 'any' type.
lib/jobs/background-jobs.ts(72,56): error TS7006: Parameter 't' implicitly has an 'any' type.
lib/jobs/background-jobs.ts(73,49): error TS7006: Parameter 't' implicitly has an 'any' type.
lib/jobs/background-jobs.ts(73,72): error TS7006: Parameter 'sum' implicitly has an 'any' type.
lib/jobs/background-jobs.ts(73,77): error TS7006: Parameter 't' implicitly has an 'any' type.
lib/jobs/background-jobs.ts(74,36): error TS7006: Parameter 't' implicitly has an 'any' type.
lib/jobs/background-jobs.ts(77,46): error TS7006: Parameter 't' implicitly has an 'any' type.
lib/jobs/background-jobs.ts(188,50): error TS7006: Parameter 'b' implicitly has an 'any' type.
