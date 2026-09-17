import { getRoomTypes } from "@/lib/data/room-types"
import { AdminRoomTypesTable } from "@/components/admin/admin-room-types-table"

export default async function AdminQuartosPage() {
  const roomTypes = await getRoomTypes()

  return <AdminRoomTypesTable roomTypes={roomTypes} />
}
