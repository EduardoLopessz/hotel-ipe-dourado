import { getAllReservations } from "@/lib/data/reservations"
import { AdminReservationsTable } from "@/components/admin/admin-reservations-table"

export default async function AdminReservasPage() {
  const reservations = await getAllReservations()

  return <AdminReservationsTable reservations={reservations} />
}
