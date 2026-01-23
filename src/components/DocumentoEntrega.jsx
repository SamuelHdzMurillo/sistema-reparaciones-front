import React from 'react';
import logoCecyte from '../assets/logo_cecyte_grande.webp';

function DocumentoEntrega({ reparacion, actualizaciones }) {
  const fechaActual = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toUpperCase();

  const fechaActualCorta = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const numeroOrden = `${reparacion?.id || 'N/A'}/${new Date().getFullYear().toString().slice(-2)}`;

  // Obtener la última actualización que tenga descripción del trabajo realizado
  const ultimaActualizacion = actualizaciones && actualizaciones.length > 0 
    ? actualizaciones[actualizaciones.length - 1] 
    : null;

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 4mm 6mm;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .documento-entrega .section {
            box-shadow: none !important;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          .documento-entrega {
            margin: 0 !important;
            padding: 4mm 6mm !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .documento-entrega .section {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-bottom: 6px !important;
          }
          .documento-entrega table {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .documento-entrega tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .documento-entrega .signaturesSection,
          .documento-entrega .footer {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .documento-entrega .imagesContainer {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .documento-entrega .imageWrapper {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>
      <div style={styles.container} className="documento-entrega">
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <img 
            src={logoCecyte} 
            alt="Logo CECYTE" 
            style={styles.logo}
          />
        </div>
        <div style={styles.headerInfo}>
          <div style={styles.institution}>
            COLEGIOS DE ESTUDIOS CIENTÍFICOS Y TECNOLÓGICOS
            <br />
            DEL ESTADO DE B.C.S.
            <br />
            DEPARTAMENTO DE INFORMÁTICA
          </div>
        </div>
      </div>

      <div style={styles.documentInfo}>
        <div style={styles.dateSection}>
          <strong>FECHA:</strong> {fechaActual}
        </div>
        <div style={styles.orderSection}>
          <strong>ORDEN DE SERVICIO No.:</strong> {numeroOrden}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>DATOS DEL EQUIPO</div>
        <table style={styles.table}>
          <tbody>
            <tr>
              <td style={styles.labelCell}><strong>Plantel / Usuario:</strong></td>
              <td style={styles.valueCell}>
                {typeof reparacion?.bien?.plantel === 'string' 
                  ? reparacion.bien.plantel 
                  : reparacion?.bien?.plantel?.nombre || reparacion?.bien?.plantel?.name || 'N/A'}
              </td>
            </tr>
            <tr>
              <td style={styles.labelCell}><strong>Tipo de Equipo:</strong></td>
              <td style={styles.valueCell}>{reparacion?.bien?.tipo_bien || 'N/A'}</td>
            </tr>
            <tr>
              <td style={styles.labelCell}><strong>Marca:</strong></td>
              <td style={styles.valueCell}>{reparacion?.bien?.marca || 'N/A'}</td>
            </tr>
            <tr>
              <td style={styles.labelCell}><strong>Modelo:</strong></td>
              <td style={styles.valueCell}>{reparacion?.bien?.modelo || 'N/A'}</td>
            </tr>
            <tr>
              <td style={styles.labelCell}><strong>No. Serie:</strong></td>
              <td style={styles.valueCell}>{reparacion?.bien?.numero_serie || 'N/A'}</td>
            </tr>
            <tr>
              <td style={styles.labelCell}><strong>No. Inventario:</strong></td>
              <td style={styles.valueCell}>{reparacion?.bien?.numero_inventario || 'N/A'}</td>
            </tr>
            <tr>
              <td style={styles.labelCell}><strong>Entidad:</strong></td>
              <td style={styles.valueCell}>
                {typeof reparacion?.bien?.entidad === 'string' 
                  ? reparacion.bien.entidad 
                  : reparacion?.bien?.entidad?.nombre || reparacion?.bien?.entidad?.name || 'N/A'}
              </td>
            </tr>
            {reparacion?.bien?.especificaciones && (
              <tr>
                <td style={styles.labelCell}><strong>Especificaciones:</strong></td>
                <td style={styles.valueCell}>{reparacion.bien.especificaciones}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>ÓRDEN DE SERVICIO</div>
        <table style={styles.table}>
          <tbody>
            <tr>
              <td style={styles.labelCell}><strong>Descripción del Problema:</strong></td>
              <td style={styles.valueCell}>{reparacion?.falla_reportada || 'N/A'}</td>
            </tr>
            <tr>
              <td style={styles.labelCell}><strong>Tipo de Mantenimiento:</strong></td>
              <td style={styles.valueCell}>Reparación</td>
            </tr>
          </tbody>
        </table>
      </div>

      {ultimaActualizacion && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>TRABAJO REALIZADO - DESCRIPCIÓN</div>
          <div style={styles.descriptionBox}>
            {ultimaActualizacion.descripcion || 'Reparación completada exitosamente.'}
          </div>
        </div>
      )}

      {reparacion?.accesorios_incluidos && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>ACCESORIOS INCLUIDOS</div>
          <div style={styles.descriptionBox}>
            {reparacion.accesorios_incluidos}
          </div>
        </div>
      )}

      <div style={styles.section}>
        <div style={styles.sectionTitle}>OBSERVACIONES</div>
        <div style={styles.observationsBox}>
          <table style={styles.observationsTable}>
            <thead>
              <tr>
                <th style={styles.obsHeader}>Equipo</th>
                <th style={styles.obsHeader}>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.obsCell}>
                  {reparacion?.bien?.marca} {reparacion?.bien?.modelo}
                  <br />
                  <span style={styles.serialText}>Serie: {reparacion?.bien?.numero_serie || 'N/A'}</span>
                </td>
                <td style={styles.obsCell}>
                  {reparacion?.accesorios_incluidos ? 'Equipo Completo' : 'Sin observaciones'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.signaturesSection}>
        <div style={styles.signatureBox}>
          <div style={styles.signatureTitle}>TÉCNICO</div>
          <div style={styles.signatureLine}></div>
          <div style={styles.signatureInfo}>
            <div style={styles.signatureName}>{reparacion?.tecnico?.nombre || 'N/A'}</div>
            {reparacion?.tecnico?.numero && (
              <div style={styles.signatureNumber}>{reparacion.tecnico.numero}</div>
            )}
          </div>
        </div>
        <div style={styles.signatureBox}>
          <div style={styles.signatureTitle}>RECIBE</div>
          <div style={styles.signatureLine}></div>
          <div style={styles.signatureInfo}>
            <div style={styles.signatureName}>{reparacion?.cliente?.nombre_completo || 'N/A'}</div>
            {reparacion?.cliente?.telefono && (
              <div style={styles.signatureNumber}>{reparacion.cliente.telefono}</div>
            )}
          </div>
        </div>
      </div>

      {reparacion?.bien?.imagenes && 
       Array.isArray(reparacion.bien.imagenes) && 
       reparacion.bien.imagenes.length > 0 && (() => {
        const imagenesValidas = reparacion.bien.imagenes
          .filter(url => typeof url === 'string' && url.trim() !== '')
          .map(url => url.trim());
        
        if (imagenesValidas.length > 0) {
          return (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>IMÁGENES DEL BIEN</div>
              <div style={styles.imagesContainer}>
                {imagenesValidas.map((url, index) => (
                  <div key={index} style={styles.imageWrapper}>
                    <img
                      src={url}
                      alt={`Imagen ${index + 1} del bien`}
                      style={styles.image}
                      onError={(e) => {
                        console.error('Error al cargar imagen:', url);
                        e.target.style.display = 'none';
                      }}
                    />
                    <div style={styles.imageLabel}>Imagen {index + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        return null;
      })()}
    </div>
    </>
  );
}

const styles = {
  container: {
    width: '210mm',
    minHeight: '297mm',
    margin: '0 auto',
    padding: '6mm 8mm',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
    fontSize: '10pt',
    lineHeight: '1.25',
    color: '#000',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
    borderBottom: '3px solid #2c5aa0',
    paddingBottom: '4px',
    paddingTop: '4px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    pageBreakInside: 'avoid',
  },
  logoContainer: {
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logo: {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
  },
  headerInfo: {
    flex: 1,
    textAlign: 'center',
  },
  institution: {
    fontSize: '11pt',
    fontWeight: 'bold',
    lineHeight: '1.4',
    textTransform: 'uppercase',
    color: '#2c5aa0',
  },
  documentInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px',
    fontSize: '10pt',
    padding: '5px 8px',
    backgroundColor: '#e8f4f8',
    borderRadius: '4px',
    borderLeft: '4px solid #2c5aa0',
  },
  dateSection: {
    flex: 1,
    color: '#2c5aa0',
    fontWeight: 'bold',
  },
  orderSection: {
    flex: 1,
    textAlign: 'right',
    color: '#2c5aa0',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: '6px',
    pageBreakInside: 'avoid',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
    padding: '5px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    backgroundColor: '#2c5aa0',
    color: '#fff',
    padding: '6px 10px',
    fontWeight: 'bold',
    fontSize: '10pt',
    marginBottom: '8px',
    marginTop: '-6px',
    marginLeft: '-6px',
    marginRight: '-6px',
    textTransform: 'uppercase',
    borderRadius: '4px 4px 0 0',
    letterSpacing: '0.5px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '6px',
  },
  labelCell: {
    width: '35%',
    padding: '6px',
    border: '1px solid #d0d0d0',
    backgroundColor: '#e8f4f8',
    fontWeight: 'bold',
    fontSize: '9pt',
    color: '#2c5aa0',
  },
  valueCell: {
    width: '65%',
    padding: '6px',
    border: '1px solid #d0d0d0',
    fontSize: '9pt',
    backgroundColor: '#ffffff',
  },
  descriptionBox: {
    border: '1px solid #d0d0d0',
    borderLeft: '4px solid #28a745',
    padding: '8px',
    minHeight: '40px',
    textAlign: 'justify',
    backgroundColor: '#f8fff9',
    fontSize: '9pt',
    borderRadius: '4px',
    lineHeight: '1.5',
  },
  observationsBox: {
    border: '1px solid #d0d0d0',
    padding: '8px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  observationsTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  obsHeader: {
    border: '1px solid #d0d0d0',
    padding: '6px',
    backgroundColor: '#2c5aa0',
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '9pt',
  },
  obsCell: {
    border: '1px solid #d0d0d0',
    padding: '6px',
    verticalAlign: 'top',
    fontSize: '9pt',
    backgroundColor: '#ffffff',
  },
  serialText: {
    fontSize: '9pt',
    color: '#666',
    fontStyle: 'italic',
  },
  signaturesSection: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '10px',
    marginBottom: '0px',
    padding: '8px',
    backgroundColor: '#f0f7ff',
    borderRadius: '6px',
    border: '2px solid #2c5aa0',
    pageBreakInside: 'avoid',
  },
  signatureBox: {
    width: '42%',
    textAlign: 'center',
    padding: '8px',
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    border: '1px solid #2c5aa0',
    boxShadow: '0 2px 4px rgba(44, 90, 160, 0.1)',
  },
  signatureTitle: {
    fontSize: '10pt',
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    paddingBottom: '4px',
    borderBottom: '2px solid #e8f4f8',
  },
  signatureLine: {
    height: '70px',
    marginBottom: '4px',
    marginTop: '4px',
    position: 'relative',
  },
  signatureInfo: {
    marginTop: '4px',
  },
  signatureName: {
    fontSize: '9pt',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '2px',
    lineHeight: '1.3',
  },
  signatureNumber: {
    fontSize: '8.5pt',
    color: '#666',
    fontStyle: 'italic',
    marginTop: '2px',
  },
  imagesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'flex-start',
    padding: '8px',
    border: '1px solid #d0d0d0',
    borderRadius: '4px',
    backgroundColor: '#f8f9fa',
  },
  imageWrapper: {
    flex: '0 0 calc(50% - 4px)',
    maxWidth: 'calc(50% - 4px)',
    marginBottom: '8px',
    border: '1px solid #d0d0d0',
    borderRadius: '4px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    pageBreakInside: 'avoid',
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block',
    maxHeight: '150mm',
    objectFit: 'contain',
  },
  imageLabel: {
    textAlign: 'center',
    padding: '4px',
    fontSize: '8pt',
    color: '#666',
    backgroundColor: '#f0f0f0',
    borderTop: '1px solid #d0d0d0',
    fontWeight: 'bold',
  },
};

export default DocumentoEntrega;
